FROM node:18

LABEL maintainer="JarvisLu1029"

WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY react-app/package*.json ./

# 安裝依賴
RUN npm install

# # 複製所有檔案
COPY react-app/ .