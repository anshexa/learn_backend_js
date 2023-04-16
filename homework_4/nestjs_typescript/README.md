## Описание
Проект на NestJs c TypeScript

### Перед использованием
Создайте файлы `.development.env` и `.production.env` с переменными окружения

## Установка

```bash
$ npm install
```

## Запуск приложения

```bash
# production
$ npm run start

# development
$ npm run start:dev
```

## Посмотреть документацию 
`http://127.0.0.1:{порт}/api/docs`

## Запуск тестов
Перед запуском тестов  
- зарегистрировать пользователя (POST запрос на `auth/registrationUser`) с правами админа  
  (чтобы при создании пользователя ему по умолчанию присвоилась роль админа, можно в файле `src/user/user.service.ts`
  временно поменять строку `27`  
`const role = await this.roleService.getRoleByValue('USER')`  на  
`const role = await this.roleService.getRoleByValue('ADMIN')` )
- в файле `tests/e2e/api.test.ts` ввести токен админа   
`const adminToken =`
- создать текстовый блок (запросом POST на `/textblock` отправить form-data)
- в файле `tests/e2e/api.test.ts` ввести id текстового блока  
`const textblockId = `
- в файле `src/user/user.service.ts` в строке `27` поменять обратно на `'USER'`  

Запуск

```bash
$ npm run test
```
## Запуск через Docker

```bash
$ docker-compose build
```
```bash
$ docker-compose up
```
