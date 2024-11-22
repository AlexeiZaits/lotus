# Stage 1: Build Vite app
FROM node:18 AS build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY frontend/package.json frontend/package-lock.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY frontend/ ./

# Собираем проект
RUN npm run build

# Stage 2: Setup Nginx to serve built files
FROM nginx:alpine

# Копируем конфигурацию nginx
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Копируем собранный фронтенд в nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Указываем порт для Nginx
EXPOSE 5174

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]