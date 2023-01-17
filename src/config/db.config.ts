import dotenv from 'dotenv';
dotenv.config();

interface Db_config {
    port: string,
    host: string,
    protocol: string,
    name: string
}

export const db_config: Db_config = {
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    protocol: process.env.DB_PROTOCOL,
    name: process.env.DB_NAME
}