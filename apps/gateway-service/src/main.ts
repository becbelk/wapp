// main.ts
import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';
import router from './gateway.router';

const app: Application = express();

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 4000;

// Middleware
app.use(cors());
app.use(express.json()); // Important for parsing JSON bodies

// Static assets
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Main router
app.use('/', router);

app.listen(port, () => {
  console.log(`[GATEWAY] Listening at http://${host}:${port}/`);
});
