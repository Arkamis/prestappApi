import mongoose from "mongoose";
import { config } from '../../config/dev';


export const connection = (url = config.mongo_uri, opts = {}) => {
    return mongoose.connect(url, {
        ...opts, 
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then(() => {
        console.log(`🎉Successfully connected to Mongo Atlas 🎉`);
    });
}

mongoose.connection.on("disconnect", connection);