FROM node:20.10

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma db push

RUN npm run seed

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start" ]