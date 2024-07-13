#!/bin/sh

echo "Waiting for MySQL to start..."
./wait-for database:3306 

echo "Database Push..."
npx prisma db push

echo "Starting the server..."
npm run start:prod