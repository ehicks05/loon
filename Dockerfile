FROM node:24-alpine as builder

WORKDIR /app

COPY package.json package-lock.json ./

ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN npm install --production=false

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"] 
