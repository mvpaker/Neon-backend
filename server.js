import express from 'express';
const app = express();

import http from 'http';
const httpServer = http.createServer(app);
import dotenv from 'dotenv';

import cors from 'cors';

dotenv.config();

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));


app.get('/', (req, res) => {
    res.send("I am here")
});

import neonRouter from './routers/neon.js';

app.use('/neon', neonRouter);

httpServer.listen(process.env.PORT || 9002, () => {

});
