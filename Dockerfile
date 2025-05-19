# Stage 1: Build
FROM node:20-alpine AS build
LABEL maintainer="495060071@qq.com"

# 切换到国内镜像源（可选，提高可靠性）
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories \
    && sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

# 安装基础工具并清理缓存
# 使用 --no-cache 保证索引最新且不保留本地缓存
RUN apk add --no-cache bash curl iputils git

# 可选：在构建前测试连通性
RUN echo "# Testing DNS and HTTP connectivity" \
    && nslookup mirrors.aliyun.com \
    && ping -c 3 mirrors.aliyun.com || echo "Warning: ping failed"

# 配置 npm & pnpm 镜像
RUN npm config set registry https://registry.npmmirror.com/ \
    && npm install -g pnpm@7.33.7 \
    && pnpm config set registry https://registry.npmmirror.com/ \
    && pnpm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/

WORKDIR /app
COPY .dockerignore ./
COPY ./ /app

# 安装依赖 & 构建文档
RUN pnpm install --frozen-lockfile \
    && pnpm docs:build


# Stage 2: Production
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
