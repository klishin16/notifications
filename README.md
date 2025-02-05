# Email Service (NestJS + Bull + PostgreSQL)

## 📌 Описание
Этот сервис предназначен для асинхронной отправки email-сообщений с поддержкой очередей (Bull), шаблонов (Handlebars) и логирования в базу данных (PostgreSQL).

## 🚀 Функционал
- 📩 **Отправка email** (обычных и шаблонных)
- 📊 **Логирование статусов отправки** (created, pending, sent, failed)
- 🔁 **Автоматические ретраи** при неудачной отправке
- 📎 **Поддержка вложений** (attachments)
- 📜 **Просмотр логов через API**
- 🔄 **Пересылка неудачных писем**
- 🌐 **Поддержка SMTP, SendGrid, Mailgun** (в планах)
- 📊 **Мониторинг через Prometheus / Grafana** (в планах)

## 🏗️ Структура проекта
```
📂 src
 ├── 📂 email
 │    ├── email.module.ts          # Модуль email-сервиса
 │    ├── email.controller.ts      # Контроллер API
 │    ├── email.service.ts         # Сервис отправки писем
 │    ├── email.processor.ts       # Обработчик очереди Bull
 │    ├── email-log.entity.ts      # Логирование email в PostgreSQL
 │    ├── email-log.service.ts     # Сервис логирования
 │
 ├── 📂 templates                  # Шаблоны писем (Handlebars)
 │    ├── welcome.hbs              # Пример шаблона email
 │
 ├── 📂 config                      # Конфигурация приложения
 │    ├── config.module.ts          # Конфигурация NestJS
 │    ├── config.service.ts         # Сервис конфигурации
 │
 ├── main.ts                        # Точка входа
 ├── app.module.ts                   # Главный модуль
```

## ⚙️ Установка и запуск
### 1️⃣ Установка зависимостей
```sh
yarn install
```

### 2️⃣ Настройка `.env` (пример)
```ini
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=password
DB_NAME=emails
REDIS_HOST=localhost
REDIS_PORT=6379
EMAIL_MAX_RETRIES=3
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
SMTP_FROM="No Reply" <noreply@example.com>
```

### 3️⃣ Запуск сервиса
```sh
# development
yarn run start

# watch mode
yarn run start:dev

# production mode
yarn run start:prod
```

### 4️⃣ Запуск Redis и Bull Dashboard
```sh
docker-compose up -d redis
npm run bull:dashboard
```

## 📝 Тестирование

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## 🛠 API Endpoints

### 📩 Отправка email
```http
POST /email/send
```
**Body (JSON):**
```json
{
  "to": "user@example.com",
  "subject": "Добро пожаловать!",
  "text": "Ваш аккаунт создан.",
  "template": "welcome",
  "templateData": { "name": "Алексей", "code": "1234" },
  "attachments": [
    { "filename": "file.pdf", "path": "/uploads/file.pdf" }
  ]
}
```

### 📜 Просмотр логов
```http
GET /email/logs?status=failed&to=user@example.com&page=1&limit=10
```

### 🔄 Повторная отправка
```http
POST /email/retry/:id
```

## 🛑 Остановка
```sh
docker-compose down
npm stop
```

## 📌 Дополнительные улучшения (в будущем)
- 🌐 Поддержка SendGrid / Mailgun
- 📊 Метрики в Prometheus / Grafana
- 🛡 Безопасность (Rate limiting, JWT)

💡 **Приглашаем к использованию и доработке! 🚀**


