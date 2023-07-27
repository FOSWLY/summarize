## [FOSWLY] Summarize Articles Extension

Небольшое расширение, позволяющее быстро пересказывать статьи.

## Установка расширения (временно не доступно):
- Firefox (версия 109+): [Link](...)
- Chrome: [Link](...)

## Как собрать расширение?
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

![example btn](https://github.com/FOSWLY/summarize-articles/blob/master/gh/screenshot.png "example image")