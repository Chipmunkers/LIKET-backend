import { INestiaConfig } from '@nestia/sdk';
import { NestFactory } from '@nestjs/core';
// import { FastifyAdaptor } from "@nestjs/platform-fastify";

import { AppModule } from './src/app.module';

const NESTIA_CONFIG: INestiaConfig = {
  input: async () => {
    const app = await NestFactory.create(AppModule);
    // const app = await NestFactory.create(YourModule, new FastifyAdaptor());
    // app.setGlobalPrefix("api");
    // app.enableVersioning({
    //     type: VersioningType.URI,
    //     prefix: "v",
    // })
    return app;
  },
  swagger: {
    output: 'dist/swagger.json',
    security: {
      bearer: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local Server',
      },
    ],
    beautify: true,
  },
};
export default NESTIA_CONFIG;
