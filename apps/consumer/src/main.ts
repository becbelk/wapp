import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoStore from 'connect-mongo';

import session from 'express-session';
import  {connectDb}  from './config/consumer.connectdb';
import consumerRouter from './consumer.routes';
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) :4002;
const sessionSecret=process.env.SESSION_SECRET! as string;
console.log("sessionSecret ",sessionSecret)
const consumer_service = express();
consumer_service.use(express.json());
connectDb();
consumer_service.use( 
  session({
    secret: sessionSecret?? "hieveryone" ,
    resave: false,
    saveUninitialized: process.env.NODE_ENV !== 'prod',
    store: mongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    ////cookie: { maxAge: new Date ( Date.now() + (3600000) ) }
  })
);
consumer_service.use('/consumer-service',consumerRouter);


consumer_service.listen(port, host, () => {
  console.log(`✅ consumer_service يعمل على: http://${host}:${port}`);
});