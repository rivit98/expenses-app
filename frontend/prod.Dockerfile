FROM node:18

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY ./frontend/package.json ./frontendpackage-lock.json ./
RUN npm install

COPY ./frontend ./
RUN npm run build

CMD ["serve", "-s", "build"]
