FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm i -g @nestjs/cli
RUN npm i -D prisma
RUN npm i @prisma/client

COPY . .

RUN npx prisma generate

EXPOSE 3372

# RUN npm run build

CMD ["npm", "run", "dev"]