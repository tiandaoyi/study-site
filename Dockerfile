FROM node:20-alpine as build
LABEL maintainer "495060071@qq.com"

RUN apk update && apk add --no-cache git

# 安装npm
RUN npm config set registry https://registry.npmmirror.com/
# 安装pnpm
RUN npm install -g pnpm@7.33.7
RUN pnpm config set registry https://registry.npmmirror.com/
RUN pnpm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/

WORKDIR /app

COPY .dockerignore .
COPY ./ /app

RUN apk update && apk add git

RUN ["pnpm", "install"]

RUN ["pnpm", "docs:build"]

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
