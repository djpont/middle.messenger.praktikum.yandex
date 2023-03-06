
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/djpont/middle.messenger.praktikum.yandex/tests.yml)](https://github.com/djpont/middle.messenger.praktikum.yandex/actions)
[![Netlify Status](https://api.netlify.com/api/v1/badges/b32e09ac-0be1-44f2-ac50-b754434586f1/deploy-status)](https://app.netlify.com/sites/dreamy-capybara-f77156/deploys)

### Ссылка на pull request
[Sprint 4](https://github.com/djpont/middle.messenger.praktikum.yandex/pull/6)


### Сборка и запуск проекта
* `npm run build`
* `npm run serve`

### Тест и проверка проекта
* `npm run test`
* `npm run eslint`
* `npm run stylelint`

### Сборка и запуск Docker
* `docker build -t messenger .`
* `docker run -d -p 3000:3000 messenger`


### Проект на Netlify
[Dreamy-capybara-f77156](https://dreamy-capybara-f77156.netlify.app)


### Описание проекта
Учебный проект "Мессенджер" для Яндекс.Практикума.
Функционал сравним с любым современным мессенджером.
Внешний вид выполнен духе приложений эпохи Windows 95/98/2000.
В качестве шаблонизатора используется Handlebars.


### Описание директорий
* `/src` - ресурсы программы
* `/src/components` - визуальные компоненты, с помощью которых создаются dom-элементы
* `/src/modules` - классы для основных сущностей мессенджера
* `/src/pages` - страницы для демонстрации работы
* `/static` - статичные элементы и картинки
* `/ui` - макет программы, выполненный на бумаге
* 

### Структура основных компонентов
Все компоненты, кроме `View`, наследуются от базового класса `Component`.
* `Component` - базовый класс, на основе которого пишутся остальные, вызывает рендер DOM-дерева при создании экземпляра, методы для обновления пропсов, а так же управление EventBus.
* `View` - пространство для рендера `Window` окон, содержащих `Content`.
* `Button`, `Input`, `Text` - базовые компоненты, могут быть созданы из пропсов или из имеющегося HTML-элемента.
* `Chatlist` - список чатов.
* `ChatFeed` - лента сообщений.

### Структура модулей
* `Fetch` - класс для работы с запросами на сервер
* `Api` - класс для работы с Api сетвера
* `Routing` - класс роутера
* `Store` - класс состояния
* `Functions` - набор вспомогательных функций

Используется стили [98.css](https://jdan.github.io/98.css/)
