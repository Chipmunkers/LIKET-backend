FROM node:20.10

WORKDIR /usr/src/app

COPY package*.json .

COPY . .

RUN npm ci

RUN npx prisma generate

RUN npm run build admin-server

EXPOSE 3000

CMD [ "npm", "run", "start", "admin-server" ]
