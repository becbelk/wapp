import dotenv from 'dotenv';
//import path from 'path';
dotenv.config();
console.log('✅ Loaded .env, MONGO_URI:', process.env.MONGO_URI);

import express from 'express';
import session from 'express-session';
import mongoStore from 'connect-mongo';
import authRouter from './auth.routes';
import { connectDb } from './config/user.connectdb';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 4009;
const auth_service = express();
connectDb();
auth_service.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: process.env.NODE_ENV !== 'prod',
    store: mongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    ////cookie: { maxAge: new Date ( Date.now() + (3600000) ) }
  })
);
auth_service.use(express.json()); // 👈 مهم لفهم body للـ POST

auth_service.use('/', authRouter);

auth_service.listen(port, host, () => {
  console.log(`✅ auth_service يعمل على: http://${host}:${port}`);
});