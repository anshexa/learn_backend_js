import {pool as db} from './db.js';

class GenreController {
    async createGenre(body, res) {
        const name = body.name
        const newGenre = await db.query(`INSERT INTO genre 
                                         (name)
                                         values($1) RETURNING *`,
                                         [name]);
        res.end(JSON.stringify(newGenre.rows[0]));
    }

    async getGenres(req, res) {
        const genres = await db.query(`SELECT * FROM genre ORDER BY genre.id;`);
        res.end(JSON.stringify(genres.rows));
    }

    async getOneGenre(id, res) {
        const genre = await db.query(`SELECT * FROM genre WHERE id=$1`, [Number(id)]);
        res.end(JSON.stringify(genre.rows));
    }

    async updateGenre(body, res) {
        const id = body.id;
        const name = body.name;
        const genre = await db.query(`UPDATE genre SET 
                                    name=$1 WHERE id=$2 RETURNING *`,
                                    [name, Number(id)]);
        res.end(JSON.stringify(genre.rows[0]));
    }

    async deleteGenre(id, res) {
        // удаляем связи с фильмами
        await db.query(`DELETE FROM film_genre WHERE genre_id=$1`, [Number(id)]);

        const genre = await db.query(`DELETE FROM genre 
                                    WHERE genre.id=$1 RETURNING *`,
                                    [Number(id)]);
        res.end(JSON.stringify(genre.rows[0]));
    }
}

let genreController = new GenreController;

export {genreController}
