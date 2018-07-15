# Начальник дискорд раздевалки [![Build Status](https://travis-ci.org/TehZarathustra/avsimach-discord.svg?branch=master)](https://travis-ci.org/TehZarathustra/avsimach-discord)

Сравнит ЛТХ/ТТХ самолетов, покажет гифки и выдаст погоны

![boss](assets/boss.jpg?width=300)

###
интеграции с google-api, giphy, imgur

## Запуск
требует node >=8.x и yarn >=1.17.0

```
yarn install
IMGUR_ID=id GIPHY_TOKEN=token BOT_TOKEN=discord-token CLIENT_SECRET=google-api-secret CLIENT_ID=google-api-id ACCESS_TOKEN=google-api-access-token REFRESH_TOKEN=google-api-refresh-token npm run start
```
