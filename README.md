## [FOSWLY] Summarize Articles Extension

Небольшое расширение, позволяющее быстро пересказывать статьи.

## 📖 Установка расширения (временно не доступно):
- Firefox (версия 109+): [Link](...)
- Chrome: [Link](...)

## 📦 Как собрать расширение?
1. Установите NodeJS 18+
2. Установите зависимости:
```bash
npm i
```
3. Сборка расширения:
```
npm run build
```

3.1. Сборка для Разработки (релоад при изменениях в коде):
```
npm run build-watch
```

3.2. Запуск линтера:
```
npm run lint
```

## ⚙️ Использование своего API прокси-сервера:
1. Установите и разверните [сервер](https://github.com/FOSWLY/summarize-articles-backend)
2. Зайдите в `src/api/yandexRequests.js` и замените API_DOMAIN на свой домен, если ваш сервер не поддерживает https, то, так же, нужно будет в yandexRequests.universalFetch поменять "https" на "http"
3. Соберите расширение

![example btn](https://github.com/FOSWLY/summarize-articles/blob/master/gh/screenshot.png "example image")