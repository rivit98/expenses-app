FROM node:21 as builder
# ENV NODE_ENV production

WORKDIR /app

COPY /package.json /package-lock.json ./
RUN npm ci

COPY . ./
RUN npm run build


FROM nginx:alpine
ENV NODE_ENV production
WORKDIR /usr/share/nginx/html
RUN rm -- *
COPY --from=builder /app/build/ .
COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"] 
