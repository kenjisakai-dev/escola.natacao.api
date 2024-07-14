FROM node:alpine

WORKDIR /app

COPY package.json ./

RUN npm install
RUN npm i -g @nestjs/cli
RUN npm i -D prisma
RUN npm i @prisma/client
RUN npm i dotenv

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3372

CMD ["npm", "run", "start:prod"]