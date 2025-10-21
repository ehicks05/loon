FROM node:24-alpine as builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --production=false

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"] 
