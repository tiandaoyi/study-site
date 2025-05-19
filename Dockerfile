# Stage 1: Build
FROM node:20-alpine AS build
LABEL maintainer="495060071@qq.com"

# 切换到国内镜像源
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

# 安装基础工具及依赖（包含 CA 证书）
RUN apk add --no-cache \
        bash \
        curl \
        iputils \
        git \
        python3 \
        make \
        g++ \
        libc6-compat \
        ca-certificates \
    && update-ca-certificates

# 可选：测试网络连通性
RUN echo "# Testing DNS and HTTP connectivity" \
    && nslookup mirrors.aliyun.com \
    && ping -c 3 mirrors.aliyun.com || echo "Warning: ping failed"

# 全局配置 npm & pnpm 使用国内镜像，并关闭严格 SSL 校验
RUN npm config set registry https://registry.npmmirror.com/ \
    && npm config set strict-ssl false \
    && npm install -g pnpm@7.33.7 \
    && pnpm config set registry https://registry.npmmirror.com/ \
    && pnpm config set strict-ssl false \
    && pnpm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/

WORKDIR /app
COPY .dockerignore ./
COPY ./ /app

# 安装依赖（去除 --strict-ssl 参数）
RUN pnpm install --registry=https://registry.npmmirror.com/ --frozen-lockfile --reporter ndjson

# 构建文档
RUN pnpm docs:build

# Stage 2: Production
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
