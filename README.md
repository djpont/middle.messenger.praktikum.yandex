
![GitHub Workflow Status (with branch)](https://img.shields.io/github/actions/workflow/status/djpont/middle.messenger.praktikum.yandex/tests.yml?branch=sprint_1)
![Netlify](https://img.shields.io/netlify/b32e09ac-0be1-44f2-ac50-b754434586f1)

### Ссылка на pull request
https://github.com/djpont/middle.messenger.praktikum.yandex/pull/2


### Запуск проекта
* `npm run start`
* `npm run build`


### Проект на Netlify
[Dreamy-capybara-f77156](https://dreamy-capybara-f77156.netlify.app/)

### Описание проекта
Учебный проект "Мессенджер" для Яндекс.Практикума.
Функционал сравним с любым современным мессенджером.
Внешний вид выполнен духе приложений эпохи Windows 95/98/2000.
В качестве шаблонизатора используется Handlebars.

### Описание директорий
* `/src` - ресурсы программы.
* `/src/components` - визуальные компоненты, с помощью которых создаются dom-элементы.
* `/src/modules` - классы для основных сущностей мессенджера.
* `/src/pages` - страницы для демонстрации работы.
* `/static` - статичные элементы и картинки.
* `/ui` - макет программы, выполненный на бумаге.

### Структура основных компонентов
Все компоненты, кроме `View`, настедуются от базового класса `Component`.
* `Component` - базовый класс, на основе которого пишутся остальные, вызывает рендер DOM-дерева при создании экземпляра, методы для обновления пропсов, а так же управление EventBus.
* `View` - пространство для рендера `Window` окон, содержащих `Content`.
* `Button`, `Input`, `Text` - базовые компоненты, могут быть созданы из пропсов или из имеющегося HTML-элемента.
* `Chatlist` - список чатов.
* `ChatFeed` - лента сообщений.


Используется стили [98.css](https://jdan.github.io/98.css/)
