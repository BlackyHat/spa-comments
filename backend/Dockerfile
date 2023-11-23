FROM node:20-alpine  AS builder
WORKDIR /app
COPY /package*.json ./
COPY . .
RUN npm rebuild --arch=x64 --platform=linux --libc=musl sharp
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3001
CMD ["npm", "run", "start:prod"]
