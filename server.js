import express from 'express';
const app = express();

import http from 'http';
const httpServer = http.createServer(app);

import dotenv from 'dotenv';
import neonRouter from './routers/neon.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));
app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use('/neon', neonRouter);
app.use(
    express.static(path.join(__dirname, '../Neon/build'))
)
app.get('*', (req, res) => {
    res.sendFile(
        path.join(__dirname, '../Neon/build/index.html')
    )
})
httpServer.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running at ${process.env.PORT} port`);
});
