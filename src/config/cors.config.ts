import { CorsOptions } from "cors";

const corsConfig: CorsOptions = {
    origin: ['http://localhost:3000'],
    credentials: true
};

export default corsConfig;
