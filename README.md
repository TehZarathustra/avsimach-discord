# Начальник дискорд раздевалки [![Build Status](https://travis-ci.org/TehZarathustra/avsimach-discord.svg?branch=master)](https://travis-ci.org/TehZarathustra/avsimach-discord)

## Команды
Все команды имеют следующий формат: `Начальник, <команда>`

Как правило, большинство команд требует талоны. О доступных талонах можно спросить
```
Начальник, сколько талонов|начальник, сколько мемов|начальник, че по талонам|начальник, че по мемам
```

### Поиск гифок
Гифки ищутся по сервисам `imgur` и `giphy`

Можно делать запрос как кириллицей, так и латиницей
```
Начальник, покажи <запрос>|начальник покажи <запрос>
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
Начальник, покажи самолет // попытается найти гифку кириллицой, шанс не оч большой
Начальник, покажи plane // латиницей, найдет много гифок
Начальник, покажи су-27 // найдет гифку из кастомного альбома
```

### Спросить случайный факт про Вьетнам
```
начальник, расскажи про вьетнам
```

### Голосование
Выдать плашку пользователю
```
Начальник, выдай <плашку> для <username>
```

Забрать плашку у пользователя
```
Начальник, забери <плашку> у <username>
```

Кикнуть пользователя
```
Начальник, кикни <username>
```

Примеры
```
Начальник, выдай суетливый для havkoduk
Начальник, забери суетливый у havkoduk
Начальник, кикни havkoduk

// также можно делать mention @havkoduk
Начальник, выдай суетливый для @havkoduk
```

### Удалять ответ начальника
```
Начальник, удали|Начальник удали|Начальник, удоли|Начальник удоли
```

### Генаратор мемов
Сделать надпись на картинке, аргументы принимаются построчно

Формат мема с подписью внизу
```
Начальник, сделай мем
<ссылка на картинку>
<подпись>
```
Формат мема с подписью наверху и внизу
```
Начальник, сделай мем
<ссылка на картинку>
<подпись снизу>
<подпись сверху>
```
Пример
```
Начальник, сделай мем
https://upload.wikimedia.org/wikipedia/commons/d/d5/Jenna_Dolan_in_AV8B_Harrier.jpeg
ХАЙ, КСТА
```

### Сравнить ЛТХ/ТТХ самолетов
```
Начальник, сравни MiG-15bis и F-86Fblock35
```
доступные самолеты для сравнения
```
MiG-15bis
MiG-17F
MiG-19P
MiG-21F-13
MiG-21bis
MiG-23ML
F-86Fblock35
F-5E-3
F-14A
F-14B
F-15C
F/A-18C
Su-25
Su-25T
Su-27
AV-8BNA
A-10C
MirageIIIE
MirageF1.CZ
M-2000C
AJS-37
```
новые типы можно добавлять по ссылке https://docs.google.com/spreadsheets/d/1SHq0E0nAIcCLE1EU1hz7Y9yEqwNAFE-tPhTc4qfJ6M4/edit

## Запуск
требует node >=8.x и yarn >=1.17.0

```
yarn install
IMGUR_ID=id GIPHY_TOKEN=token BOT_TOKEN=discord-token CLIENT_SECRET=google-api-secret CLIENT_ID=google-api-id ACCESS_TOKEN=google-api-access-token REFRESH_TOKEN=google-api-refresh-token npm run start
```
