import env from './config/env';
import app from "./app";
import mongoClient from './utils/mongoClient';

const server = async () => {
    await mongoClient.connect();

    app.listen(env.httpPort, () => {
        console.log(`Server On   PORT:${env.httpPort}`);
    });
}

server();

export default server;
