import mongoose from "mongoose";
import config from '../../config';

export const connection = (url = config.mongo_uri, opts = {}) => {
    return mongoose.connect(url, {
        ...opts, 
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then(() => {
        console.log(`🎉Successfully connected to Mongo, Enviroment:${config.env} 🎉`);
    });
}

mongoose.connection.on("disconnect", connection);