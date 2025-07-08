# Тестовая задача backend сервиса на Express.js

## Описание

Данный backend сервис реализует работу с пользователями, поддерживает регистрацию, JWT-авторизацию (access/refresh токены), разграничение прав (admin/user), блокировку пользователей и повышение роли. Все данные хранятся в PostgreSQL, используется TypeORM и TypeScript. Refresh токен хранится в httpOnly cookie.

### Основные возможности:
- Регистрация пользователя
- JWT-авторизация (accessToken в ответе, refreshToken в cookie)
- Получение пользователя по ID (admin или сам пользователь)
- Получение списка пользователей (только admin)
- Блокировка пользователя (admin или сам пользователь)
- Повышение роли пользователя до admin (только admin)
- Логирование всех HTTP-запросов в файл

## Установка и запуск (локально)

1. **Клонируйте репозиторий:**
   ```bash
   git clone https://github.com/korvintaG/Express-backend-service.git 
   cd Express-backend-service
   ```
2. **Установите зависимости:**
   ```bash
   npm install
   ```
3. **Создайте файл `.env` в корне проекта:**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASS=postgres
   DB_NAME=test
   JWT_ACCESS_SECRET=access_secret
   JWT_REFRESH_SECRET=refresh_secret
   ```
4. **Запустите PostgreSQL** (например, через Docker):
   ```bash
   docker run --name pg-test -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=test -p 5432:5432 -d postgres:15-alpine
   ```
5. **Соберите и запустите сервис:**
   ```bash
   npm run build
   npm start
   ```
   Сервис будет доступен на http://localhost:3000

## Установка и запуск через Docker Compose

1. **Убедитесь, что у вас есть Docker и Docker Compose.**
2. **Создайте файл `.env` (как выше) или используйте переменные по умолчанию из compose.yaml.**
3. **Запустите сервис:**
   ```bash
   docker compose up --build
   ```
   - Backend будет доступен на http://localhost:3000
   - PostgreSQL будет доступен на порту 5432

## Документация API

- Описание всех endpoint и моделей находится в файле [`openapi.yaml`](./openapi.yaml) (OpenAPI 3.0, Swagger).
- Пример коллекции для Postman: [`express-backend-service.postman_collection.json`](./express-backend-service.postman_collection.json)

## Тестирование

- Юнит- и интеграционные тесты запускаются командой:
  ```bash
  npm test
  ```
- Для интеграционных тестов используется in-memory SQLite, рабочая база не затрагивается.

## Стек технологий
- Node.js, TypeScript, Express.js
- PostgreSQL, TypeORM
- JWT (jsonwebtoken)
- class-validator, class-transformer
- Docker, Docker Compose

## Структура проекта

```
src/
  controllers/
  services/
  routes/
  middlewares/
  dtos/
  entity/
  utils/
  __tests__/
  app.ts
  index.ts
```
