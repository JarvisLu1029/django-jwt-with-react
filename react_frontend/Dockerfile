FROM node:18

LABEL maintainer="JarvisLu1029"

WORKDIR /app/react_frontend

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴
RUN npm install

# 複製所有源代碼到工作目錄
COPY . .