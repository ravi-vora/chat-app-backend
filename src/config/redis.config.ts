import dotenv from 'dotenv'
dotenv.config();

interface Redis {
    port: string,
    protocol: string,
    host: string
}

export const redisConfig : Redis = {
    port: process.env.REDIS_PORT,
    protocol: process.env.REDIS_PROTOCOL,
    host: process.env.REDIS_HOST
}