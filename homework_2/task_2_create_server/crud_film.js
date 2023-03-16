import {pool as db} from './db.js';

class FilmController {
    async createFilm(body, res) {
        const name = body.name;
        const productionYear = body.production_year;

        const newFilm = await db.query(`INSERT INTO film 
                                        (name, production_year) 
                                        values ($1, $2) RETURNING *`,
                                        [name, productionYear]);

        let arrGenre = []
        if (body.genre_names.length > 0) {
            let genreNames = body.genre_names.split(', ');

            arrGenre = await this.addReferencesToGenres(genreNames, newFilm, arrGenre);
        }
        newFilm.rows[0]['genres'] = arrGenre;
        res.end(JSON.stringify(newFilm.rows[0]));
    }

    async addReferencesToGenres(genreNames, film, arrGenre) {
        for (let genreName of genreNames) {
            // проверяем на существование жанра
            const genre = await db.query(`SELECT * FROM genre WHERE name=$1`, [genreName]);
            if (genre.rowCount > 0) {
                // добавляем связь с жанрами
                await db.query(`INSERT INTO film_genre 
                                        (film_id, genre_id) 
                                        values ($1, $2)`,
                                        [film.rows[0].id, genre.rows[0].id]);
                arrGenre.push(genre.rows[0]);
            }
        }
        return arrGenre;
    }

    async getFilms(req, res) {
        const films = await db.query(`SELECT film.*, array_agg(genre.name) AS genres
                                    FROM film 
                                    LEFT JOIN film_genre ON film_genre.film_id=film.id 
                                    LEFT JOIN genre ON film_genre.genre_id=genre.id 
                                    GROUP BY film.id 
                                    ORDER BY film.id;`);
        res.end(JSON.stringify(films.rows));
    }

    async getOneFilm(id, res) {
        const film = await db.query(`SELECT film.*, array_agg(genre.name) AS genres 
                                    FROM film 
                                    LEFT JOIN film_genre ON film_genre.film_id=film.id 
                                    LEFT JOIN genre ON film_genre.genre_id=genre.id 
                                    WHERE film.id=$1 
                                    GROUP BY film.id;`,
                                    [Number(id)]);
        res.end(JSON.stringify(film.rows[0]));
    }

    async updateFilm(body, res) {
        const id = body.id;
        const name = body.name;
        const productionYear = body.production_year;
        const film = await db.query(`UPDATE film SET 
                                    name=$1, production_year=$2 WHERE id=$3 RETURNING *`,
                                    [name, productionYear, Number(id)]);
        let arrGenre = []
        if (body.genre_names.length > 0) {
            let genreNames = body.genre_names.split(', ');
            // удаляем старые связи с жанрами
            await db.query(`DELETE FROM film_genre WHERE film_id=$1`, [Number(id)]);

            arrGenre = await this.addReferencesToGenres(genreNames, film, arrGenre);
        }
        film.rows[0]['genres'] = arrGenre;
        res.end(JSON.stringify(film.rows[0]));
    }

    async deleteFilm(id, res) {
        // удаляем связи с жанрами
        await db.query(`DELETE FROM film_genre WHERE film_id=$1`, [Number(id)]);

        const film = await db.query(`DELETE FROM film 
                                    WHERE film.id=$1 RETURNING *`,
                                    [Number(id)]);
        res.end(JSON.stringify(film.rows[0]));
    }
}

let filmController = new FilmController;

export {filmController}
