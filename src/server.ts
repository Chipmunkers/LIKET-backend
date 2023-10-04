import env from './config/env';
import app from "./app";
import mongoClient from './utils/mongoClient';
import redisClient from './utils/redisClient';

const server = async () => {
    //await redisClient.connect();

    //await mongoClient.connect();

    app.listen(env.httpPort, () => {
        console.log(`Server On   PORT:${env.httpPort}`);
    });
}

server();

export default server;
