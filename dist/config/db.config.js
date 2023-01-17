import dotenv from 'dotenv';
dotenv.config();
export const db_config = {
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    protocol: process.env.DB_PROTOCOL,
    name: process.env.DB_NAME
};
//# sourceMappingURL=db.config.js.map