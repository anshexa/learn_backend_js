import * as dotenv from 'dotenv';
import * as http from "node:http";
import path from 'node:path';

import {genreController} from './crud_genre.js';
import {filmController} from "./crud_film.js";

dotenv.config();

const PORT = process.env.SERVER_PORT;


const server = http.createServer((req, res) => {
    let data = '';
    // собираем части данных
    req.on('data', chunk => {
        data += chunk;
    });
    // данные полностью получены
    req.on('end', () => {
        let body;
        res.writeHead(200, {
            'Content-Type': 'application/json'
        })

        // endpoint /film
        if (req.url.startsWith('/film')) {
            if (path.basename(req.url) === 'film') {
                switch (req.method) {
                    case 'GET':
                        filmController.getFilms(req, res);
                        break;
                    case 'POST':
                        body = JSON.parse(data);
                        filmController.createFilm(body, res);
                        break;
                    case 'PUT':
                        body = JSON.parse(data);
                        filmController.updateFilm(body, res);
                        break;
                }
            }
            else {
                // endpoint /film/:id
                let id = path.basename(req.url);
                switch (req.method) {
                    case 'GET':
                        filmController.getOneFilm(id, res);
                        break;
                    case 'DELETE':
                        filmController.deleteFilm(id, res);
                        break;
                }
            }
        }

        // endpoint /genre
        if (req.url.startsWith('/genre')) {
            if (path.basename(req.url) === 'genre') {
                switch (req.method) {
                    case 'GET':
                        genreController.getGenres(req, res);
                        break;
                    case 'POST':
                        body = JSON.parse(data);
                        genreController.createGenre(body, res);
                        break;
                    case 'PUT':
                        body = JSON.parse(data);
                        genreController.updateGenre(body, res);
                        break;
                }
            }
            else {
                // endpoint /genre/:id
                let id = path.basename(req.url);
                switch (req.method) {
                    case 'GET':
                        genreController.getOneGenre(id, res);
                        break;
                    case 'DELETE':
                        genreController.deleteGenre(id, res);
                        break;
                }
            }
        }
    })
});

server.listen(PORT, () => console.log(`Server running at http://127.0.0.1:${PORT}/`));
