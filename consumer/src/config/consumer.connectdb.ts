import mongoose from 'mongoose';


export const connectDb =
    () => {
       const  dburi=process.env.MONGO_URI! as string
        if(!dburi){ console.log("no mongouri");}
        else{
        mongoose
        .connect(dburi)
        .then(() => console.log("Database connected successfully!"))
        .catch(error => console.log(error));}
    }
