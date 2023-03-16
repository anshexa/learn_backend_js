Создайте файл `.env` с переменными окружения
```angular2html
SERVER_PORT=5000

PG_USER='user'
PG_PASSWORD='password'
PG_HOST='host'
PG_PORT=5432
PG_DB_NAME='name'
```

### Схемы запросов к серверу

**POST** /film
```
{
"name": "фильм",
"production_year": 2023,
"genre_names": "фантастика, фентези, детектив"
}
```

**POST** /genre
```
{
"name": "фентези"
}
```

**PUT** /film
```
{
"id": 1,
"name": "фильм",
"production_year": 2022,
"genre_names": "фантастика, детектив"
}
```

**PUT** /genre
```
{
"id": 1,
"name": "Супер фантастика"
}
```

**GET** /film , /genre

Чтобы получить все записи - отправьте запрос без параметров.  
Чтобы получить конкретную запись - добавьте id в URL

`/film/2` `/genre/2`

**DELETE** /film , /genre

Добавьте id в URL 

`/film/2` `/genre/2`
