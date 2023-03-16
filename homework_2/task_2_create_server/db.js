import * as dotenv from 'dotenv';
import pg from 'pg';

const {Pool} = pg;
dotenv.config()


const pool = new Pool({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DB_NAME
})


export {pool}
