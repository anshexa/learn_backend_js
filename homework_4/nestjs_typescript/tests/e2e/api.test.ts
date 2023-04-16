import * as request from 'supertest'
import {Test} from "@nestjs/testing";

import {AppModule} from "../../src/app.module";


// ввести актуальный токен админа перед тестами
const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIxQCIsImlkIjoyLCJyb2xlIjpbeyJpZCI6MSwidmFsdWUiOiJBRE1JTiIsImRlc2NyaXB0aW9uIjoi0JDQtNC80LjQvdC40YHRgtGA0LDRgtC-0YAiLCJjcmVhdGVkQXQiOiIyMDIzLTA0LTEyVDE5OjE1OjE3LjkzN1oiLCJ1cGRhdGVkQXQiOiIyMDIzLTA0LTEyVDE5OjE1OjE3LjkzN1oifV0sImlhdCI6MTY4MTY3OTEyNCwiZXhwIjoxNjgxNzY1NTI0fQ._nKSLwkydI2C0dZK8X5uDITaiKNFGZaSJRFnlGzkqwQ'
let userToken: string = null
let userId: any = null
const emailUser = 'test@example.com'
const passwordUser = '123'
let profileId: any = null
const textblockId = '1'


describe('Tests', () => {
    let httpServer: any;
    let app: any;

    beforeAll(async () => {
        // подключаем приложение
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
        httpServer = app.getHttpServer();
    })

    describe('AuthController', () => {

        it('должен создать пользователя', async () => {
            const createUserRequest = {
                email: emailUser,
                password: passwordUser
            }
            const response1 = await request(httpServer)
                .post('/auth/registrationUser')
                .send(createUserRequest)

            expect(response1.status).toBe(201);
            // вернуть токен
            expect(response1.body).toHaveProperty('token');
            userToken = response1.body['token']

            // иметь созданного юзера в бд в списке юзеров
            const response2 = await request(httpServer)
                .get('/user')
                .auth(adminToken, {type: "bearer"})

            const user = response2.body.find(el => el.email == createUserRequest.email)
            expect(user).toMatchObject({email: createUserRequest.email})
            userId = user.id
        })

        it('не должен повторно создать пользователя', async () => {
            const createUserRequest = {
                email: emailUser,
                password: passwordUser
            }
            await request(httpServer)
                .post('/auth/registrationUser')
                .send(createUserRequest)
                .expect(400)
        })

    })


    describe('ProfileController', () => {

        it('должен создать профиль', async () => {
            const createProfileRequest = {
                firstName: 'test_firstName',
                lastName: 'test_firstName',
                phone: 'test_phone',
                email: emailUser,
                password: passwordUser
            }
            const response1 = await request(httpServer)
                .post('/profile')
                .send(createProfileRequest)
                .expect(201)

            profileId = response1.body['id']

            // иметь созданный профиль у юзера в списке юзеров
            const response2 = await request(httpServer)
                .get('/user')
                .auth(adminToken, {type: "bearer"})
            const user = response2.body.find(el => el.id == userId)
            expect(user.profile).toMatchObject({
                firstName: createProfileRequest.firstName,
                lastName: createProfileRequest.lastName,
                phone: createProfileRequest.phone
            })
        })


        it('не должен удалить профиль', async () => {
            await request(httpServer)
                .delete(`/profile/delete/${-100}`)
                .auth(adminToken, {type: "bearer"})
                .expect(404)
        })

        it('должен удалить профиль', async () => {
            await request(httpServer)
                .delete(`/profile/delete/${profileId}`)
                .auth(adminToken, {type: "bearer"})
                .expect(200)
        })

        it('должен получить нулевой профиль по id пользователя ', async () => {
            // не иметь профиль юзера в списке юзеров
            const response = await request(httpServer)
                .get('/user')
                .auth(adminToken, {type: "bearer"})

            const user = response.body.find(el => el.id == userId)
            expect(user.profile).toBe(null)
        });

    })


    describe('UserController', () => {

        describe('Получить всех пользователей', () => {

            it('неавторизованный пользователь, должен вернуть статус 403', async () => {
                await request(httpServer)
                    .get('/user')
                    .expect(403)    // статус нет доступа
            })

            it('авторизованный пользователь, но не админ, должен вернуть статус 403', async () => {
                await request(httpServer)
                    .get('/user')
                    .auth(userToken, {type: "bearer"})
                    .expect(403)    // статус нет доступа
            })

            it('доступ админа, должен вернуть статус 200', async () => {
                await request(httpServer)
                    .get('/user')
                    .auth(adminToken, {type: "bearer"})
                    .expect(200)
            })
        })
    })


    describe('TextblockController', () => {

        it('не должен обновить текстовый блок из-за некорректных полей', async () => {
            await request(httpServer)
                .put(`/textblock/edit/${textblockId}`)
                .auth(adminToken, {type: "bearer"})
                .send({})
                .expect(404)
        });

        it('должен удалить текстовый блок и его связь с файлом', async () => {
            // получаем все текстовые блоки
            const response1 = await request(httpServer)
                .get('/textblock')

            // отбираем нужный
            const textblock = response1.body.find(el => el.id == textblockId)
            // получаем fileId
            const image = textblock.image
            const fileId = image[0].id

            // удаляем текстовый блок
            await request(httpServer)
                .delete(`/textblock/delete/${textblockId}`)
                .auth(adminToken, {type: "bearer"})
                .expect(200)

            // проверяем, что связь удалилась
            // получаем список всех файлов
            const response2 = await request(httpServer)
                .get('/file')
            // отбираем нужный
            const file = response2.body.find(el => el.id == fileId)
            expect(file.essenceTable).toBe(null)
            expect(file.essenceId).toBe(null)
        })

    })


    afterAll(async () => {
        await app.close();
    })
})
