# Начальник дискорд раздевалки [![Build Status](https://travis-ci.org/TehZarathustra/avsimach-discord.svg?branch=master)](https://travis-ci.org/TehZarathustra/avsimach-discord)

## Команды
Все команды начинаются имеют следующий формат: `Начальник, <команда>`

### Поиск гифок
Гифки ищутся по сервисам `imgur` и `giphy`
Можно делать запрос как кириллицей, так и латиницей
```
начальник, покажи <запрос>|начальник покажи <запрос>
```
Также существуют кастомные альбомы
```
су-27|су27|su27|su-27
су-30|су30|su30|su-30
миг-23|миг23|mig23|mig-23
f\/a-18|f18|хорнет|порнет|ф18|ф-18
f-14|f14|f-14b|f14b|томкет|tomcat|томкек|ф14|ф-14|ф14б|ф-14б
```
Примеры
```
начальник, покажи самолет // попытается найти гифку кириллицой, шанс не оч большой
начальник, покажи plane // латиницей, найдет много гифок
начальник, покажи су-27 // найдет гифку из кастомного альбома
```


## Запуск
требует node >=8.x и yarn >=1.17.0

```
yarn install
IMGUR_ID=id GIPHY_TOKEN=token BOT_TOKEN=discord-token CLIENT_SECRET=google-api-secret CLIENT_ID=google-api-id ACCESS_TOKEN=google-api-access-token REFRESH_TOKEN=google-api-refresh-token npm run start
```
