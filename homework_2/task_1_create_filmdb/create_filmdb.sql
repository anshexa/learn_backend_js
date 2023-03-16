CREATE TABLE filmperson
(
	id serial PRIMARY KEY,
	name VARCHAR ( 128 ) NOT NULL,
	role VARCHAR ( 128 ) NOT NULL
);

CREATE TABLE genre
(
	id serial PRIMARY KEY,
	name VARCHAR ( 128 ) NOT NULL
);

CREATE TABLE audiotrack
(
	id serial PRIMARY KEY,
	name VARCHAR ( 128 ) NOT NULL
);

CREATE TABLE distributor
(
	id serial PRIMARY KEY,
	name VARCHAR ( 128 ) NOT NULL
);

CREATE TABLE person
(
	id serial PRIMARY KEY,
	name VARCHAR ( 128 ) NOT NULL
);

CREATE TABLE video_quality
(
	id serial PRIMARY KEY,
	name VARCHAR ( 20 ) NOT NULL
);

CREATE TABLE country
(
	id serial PRIMARY KEY,
	name VARCHAR ( 64 ) NOT NULL
);

CREATE TABLE film
(
	id serial PRIMARY KEY,
	name VARCHAR ( 225 ) NOT NULL,
	original_name VARCHAR ( 225 ),
	age VARCHAR ( 3 ),
	short_description TEXT,
	subtitles VARCHAR ( 60 ),
	poster TEXT,
	production_year VARCHAR ( 4 ),
	tagline TEXT,
	budget NUMERIC,
	marketing NUMERIC,
	usa_fees NUMERIC,
	world_fees NUMERIC,
	russia_premiere DATE,
	world_premiere DATE,
	dvd_release VARCHAR ( 60 ),
	mpaa_rating VARCHAR ( 10 ),
	time VARCHAR ( 60 ),
	description TEXT,

	fk_distributor_id int REFERENCES distributor (id) NOT NULL,
	fk_country_id int REFERENCES country (id) NOT NULL,

	fk_director_id int REFERENCES person (id) NOT NULL,
	fk_scenario_id int REFERENCES person (id) NOT NULL,
	fk_producer_id int REFERENCES person (id) NOT NULL,
	fk_operator_id int REFERENCES person (id) NOT NULL,
	fk_composer_id int REFERENCES person (id) NOT NULL,
	fk_artist_id int REFERENCES person (id) NOT NULL,
	fk_installation_id int REFERENCES person (id) NOT NULL,

	fk_video_quality_id int REFERENCES video_quality (id) NOT NULL
);

CREATE TABLE audience
(
	id serial PRIMARY KEY,
	name VARCHAR ( 64 ) NOT NULL,
	quantity VARCHAR ( 60 ) NOT NULL,
	fk_film_id int REFERENCES film (id) NOT NULL
);

CREATE TABLE film_filmperson
(
	film_id INT REFERENCES film (id),
	filmperson_id INT REFERENCES filmperson (id),

	CONSTRAINT film_filmperson_pkey PRIMARY KEY (film_id, filmperson_id)
);

CREATE TABLE film_genre
(
	film_id INT REFERENCES film (id),
	genre_id INT REFERENCES genre (id),

	CONSTRAINT film_genre_pkey PRIMARY KEY (film_id, genre_id)
);

CREATE TABLE film_audiotrack
(
	film_id INT REFERENCES film (id),
	audiotrack_id INT REFERENCES audiotrack (id),

	CONSTRAINT film_audiotrack_pkey PRIMARY KEY (film_id, audiotrack_id)
);
