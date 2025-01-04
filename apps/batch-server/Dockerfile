# 1. 빌드 스테이지
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json .

COPY . .

RUN npm ci

RUN npx prisma generate

RUN npm run build batch-server

# 2. 실행 스테이지
FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./

EXPOSE 3000

CMD [ "node", "dist/apps/batch-server/main.js" ]
