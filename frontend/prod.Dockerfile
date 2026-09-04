# Kept in step with .node-version: CI passes --build-arg NODE_VERSION=$(cat .node-version)
ARG NODE_VERSION=24.19.0
FROM node:${NODE_VERSION} AS builder
# ENV NODE_ENV production

WORKDIR /app

# .npmrc must land before `npm ci` so engine-strict applies inside the image too
COPY package.json package-lock.json .npmrc ./
RUN npm ci

COPY . ./
RUN npm run build


FROM nginx:alpine
ENV NODE_ENV=production
WORKDIR /usr/share/nginx/html
RUN rm -- *
COPY --from=builder /app/build/ .
COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"] 
