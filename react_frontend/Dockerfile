FROM node:18

LABEL maintainer="JarvisLu1029"

WORKDIR /app/react-app

# 複製 package.json 和 package-lock.json
COPY react-app/package*.json ./

# 安裝依賴
RUN npm install