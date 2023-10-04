import { createClient } from 'redis';
import env from '../config/env';

export default createClient({
    socket: {
        host: env.redisHost
    }
});
