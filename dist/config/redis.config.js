import dotenv from 'dotenv';
dotenv.config();
export const redisConfig = {
    port: process.env.REDIS_PORT,
    protocol: process.env.REDIS_PROTOCOL,
    host: process.env.REDIS_HOST
};
//# sourceMappingURL=redis.config.js.map