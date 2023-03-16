CREATE TABLE IF	NOT EXISTS film
(
	id SERIAL PRIMARY KEY,
	name VARCHAR(225) NOT NULL,
	production_year VARCHAR(4)
);

CREATE TABLE IF	NOT EXISTS genre
(
	id serial PRIMARY KEY,
	name VARCHAR(128) NOT NULL
);

CREATE TABLE IF	NOT EXISTS film_genre
(
	film_id INT REFERENCES film ( id ),
	genre_id INT REFERENCES genre ( id ),
	CONSTRAINT film_genre_pkey PRIMARY KEY ( film_id, genre_id )
);
