# Stage 1: Build
FROM node:20-alpine AS build
LABEL maintainer="495060071@qq.com"

# 切换到国内镜像源
#RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

# 安装编译工具和 CA 证书
RUN apk add --no-cache \
        bash \
        curl \
        git \
        python3 \
        make \
        g++ \
        libc6-compat \
        ca-certificates \
    && update-ca-certificates

# 测试网络连通性（可选）
# RUN nslookup mirrors.aliyun.com \
#  && ping -c 2 mirrors.aliyun.com || echo "⚠️ DNS 或网络异常"

WORKDIR /app

# 先拷贝依赖清单
COPY package.json pnpm-lock.yaml ./

# 安装所有依赖，包括 devDependencies
# --prod=false 强制安装 devDependencies
RUN npm config set strict-ssl false \
 && npm install -g pnpm@7.33.7 \
 && pnpm config set strict-ssl false \
 && pnpm install --frozen-lockfile --reporter ndjson --prod=false

# 拷贝项目源代码
COPY . .

# 构建文档
RUN pnpm docs:build

# Stage 2: Production 镜像
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
