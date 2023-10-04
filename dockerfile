FROM node:18

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY ./ /app/

RUN npm run build

RUN npx prisma generate

CMD ["node", "./dist/server.js"] 