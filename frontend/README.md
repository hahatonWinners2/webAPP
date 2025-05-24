# Панель управления клиентами

React-приложение для управления клиентами с возможностью просмотра, добавления и редактирования информации о клиентах.

## Технологии

- React (Vite)
- React Router DOM
- Axios
- Recharts
- Чистый CSS

## Установка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd client-dashboard
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` в корневой директории проекта и добавьте:
```
VITE_API_URL=http://localhost:3000
```

4. Запустите приложение:
```bash
npm run dev
```

## Функциональность

- Просмотр списка клиентов
- Фильтрация клиентов по адресу, статусу и коэффициенту
- Добавление новых клиентов
- Редактирование информации о клиентах
- Просмотр детальной информации о клиенте
- График потребления для каждого клиента
- Генерация PDF-документов

## API Endpoints

- `GET /api/clients` - получение списка клиентов
- `POST /api/clients` - создание нового клиента
- `GET /api/clients/:id` - получение информации о клиенте
- `PUT /api/clients/:id` - обновление информации о клиенте
- `GET /api/clients/:id/consumption` - получение данных о потреблении
- `POST /api/clients/:id/pdf` - генерация PDF-документа

## Структура проекта

```
src/
  ├── components/
  │   ├── ClientList.jsx
  │   ├── ClientDetails.jsx
  │   ├── AddClientModal.jsx
  │   └── ...
  ├── App.jsx
  ├── main.jsx
  └── ...
```

## Разработка

```bash
# Запуск в режиме разработки
npm run dev

# Сборка проекта
npm run build

# Предпросмотр собранного проекта
npm run preview
```

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
