import http from 'http'
import express from 'express'
import { connectToDatabase } from './services/database.service.js'
import { Server } from 'socket.io'
import { connectToRedis } from './services/redis.service.js'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

connectToDatabase().then(() : void => {
    connectToRedis().then(() : void => {
        const port : string = process.env.PORT || '3000';
        const app = express();

        const httpServer = http.createServer(app);
        const io = new Server(httpServer, {
            cors: {
              origin: "*"
            }
        });

        io.on('connection', (socket) : void => {
            console.log(`socket connected : ${socket.id}`);
        })

        httpServer.listen(port, () : void => {
            console.log(`Server is running on port : ${port}`);
        })
    }).catch((e: Error) : void => {
        // sends mail to project manager.

        console.log(`Redis connection failed: ${e.message}`);
    })
}).catch((e: Error) : void => {
    // sends mail to project manager.

    console.log(`Database connection failed: ${e.message}`);
})