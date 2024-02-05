FROM node:21 as builder
# ENV NODE_ENV production

WORKDIR /app

COPY ./frontend/package.json ./frontend/package-lock.json ./
RUN npm ci

COPY ./frontend ./
RUN npm run build

FROM nginx:alpine
ENV NODE_ENV production
WORKDIR /usr/share/nginx/html
RUN rm *
COPY --from=builder /app/build/ .
