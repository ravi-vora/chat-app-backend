import http from 'http';
import express from 'express';
import { connectToDatabase } from './services/database.service.js';
import { Server } from 'socket.io';
import { connectToRedis } from './services/redis.service.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
connectToDatabase().then(() => {
    connectToRedis().then(() => {
        const port = process.env.PORT || '3000';
        const app = express();
        const httpServer = http.createServer(app);
        const io = new Server(httpServer, {
            cors: {
                origin: "*"
            }
        });
        io.on('connection', (socket) => {
            console.log(`socket connected : ${socket.id}`);
        });
        httpServer.listen(port, () => {
            console.log(`Server is running on port : ${port}`);
        });
    }).catch((e) => {
        // sends mail to project manager.
        console.log(`Redis connection failed: ${e.message}`);
    });
}).catch((e) => {
    // sends mail to project manager.
    console.log(`Database connection failed: ${e.message}`);
});
//# sourceMappingURL=index.js.map