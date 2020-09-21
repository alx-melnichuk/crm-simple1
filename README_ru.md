>Статья на английском языке [README.md](https://github.com/alx-melnichuk/crm-simple1/blob/master/README.md)

## Объединить несколько Angular приложений в одно сложное. (часть 1)

### Введение

Часто возникает ситуация, когда компания разрабатывает большой программный комплекс с большим количеством функционала. И при этом отдел маркетинга ставит задачу: предоставлять клиентам не сразу весь функционал, а только ту часть, которая ему требуется (которая была оплачена). Другими словами программный комплекс должен быть модульным.

К примеру, один пункт глобального меню - это один бизнес модуль с функционалом по работе с клиентами. В котором реализовано: создание, редактирование, удаление клиента, отображение вложенности клиентов, группировка клиентов по категориям и так далее.
Второй пункт глобального меню - это второй бизнес модуль с функционалом по работе с товаром. И так далее. При этом бизнес модули должны быть независимыми друг от друга, что бы можно было быстро отключить бизнес модуль или наоборот быстро подключить бизнес модуль.

Получается, что программный комплекс это 'конструктор', который собирается из требуемых для данного клиента бизнес модулей. Такой подход позволит сформировать большое количество программ с различным набором функциональных бизнес модулей. И это позволит прилечь больше клиентов.

Однако на практике требование независимости каждого бизнес модуля не соблюдается. Потому что команда разработчиков меняется в процессе создания программного комплекса. При этом нельзя исключить человеческий фактор: 'я не знал' или 'так было быстрее и проще'. Сущности одного бизнес модуля (классы, службы, компоненты и так далее) внедряются в другой бизнес модуль. И эти бизнес модули становятся связанными и влияют один на другого. Изменения в первом бизнес модуле влекут за собой изменения в других бизнес модулях, которые от него зависят. Программный комплекс превращается в 'неповоротливого монстра'. Увеличивается время разработки и тестирования функционала, так как требуется учитывать имеющиеся зависимости между модулями. Компания тратит больше времени и денег на сопровождение данного программного комплекса. И через небольшой промежуток времени компания теряет клиентов.

В Angular имеется возможность создать одно приложение, которое включает в себя другие приложения. Примеры такого подхода можно посмотреть в статье '[Combining Multiple Angular Applications into a Single One](https://medium.com/disney-streaming/combining-multiple-angular-applications-into-a-single-one-e87d530d6527)' и '[Angular workspaces: multi-application projects](https://octoperf.com/blog/2019/08/22/kraken-angular-workspace-multi-application-project/)'.

Создадим приложение на Angular с независимыми приложениями (проектами) в одном основном приложении.

### Предварительные условия

Для Angular требуется версия Node.js 10.9.0 или более поздняя. Запустите: 'node -v' что бы проверить текущую версию. (использовалась: 'v12.18.2'). Вы можете загрузить NodeJS с узла [nodejs.org](https://nodejs.org/en/) или установить его с помощью [диспетчера пакетов](https://nodejs.org/en/download/package-manager/).

Приложения Angular зависят от внешних библиотек, доступных в виде пакетов npm. Менеджер пакетов npm имеется в Node.js. Запустите: 'npm -v' чтобы проверить версию npm. (использовалась: '6.14.8'). Обновить npm до последней доступной версии с помощью команды 'npm install -g npm@latest'.

### Установить локально @angular/cli

Создать каталог для проекта и перейти в него:
```bash
$ mkdir /home/alexey/ws_ts3/crm-simple1/
$ cd /home/alexey/ws_ts3/crm-simple1/
```
Установить локально требуемую версию @angular/cli (использовалась версия Angular 10):
```bash
$ npm install @angular/cli@10
```
Можно установить локально последнюю версию:
```bash
$ npm install @angular/cli@latest
```
В результате в текущем каталоге появляется новый подкаталог 'node_modules', в котором содержится требуемая версия @angular/cli.

В дальнейшем будем использовать программу **npx**. Это программа, которая автоматически устанавливается вместе с **node** и **npm** версии 5.2.0 и выше. Она позволяет использовать локально установленные инструментов без их глобальной установки. **npx** запускает **ng** из локального каталога ./node_modules/@angular/cli/bin/ng. Эта утилита меняет $PATH для конкретного вызова, добавляя туда путь './node_modules/.bin'. Именно поэтому начинают работать локально установленные программы.

Программа **npx** имеет следующий формат работы:
```bash
$ npx <тут любая программа, установленная как локальный пакет npm> <тут опции этой программы>
```

### Создать рабочее пространство

Команда [ng new](https://angular.io/cli/new) создает папку _рабочего пространства Angular_ и новый скелет приложения. Рабочее пространство может содержать несколько приложений и библиотек. Основное приложение, созданное командой `ng new`, находится на верхнем уровне рабочей области в каталоге `src`. Когда создаете дополнительное приложение или библиотеку в рабочей области, оно попадает во вложенную папку `projects` под своим названием. У каждого дополнительного приложения есть каталог `src`, в котором содержится логика, данные и активы.

Для продолжения переходим в каталог основного приложения:
```bash
$ cd /home/alexey/ws_ts3/crm-simple1/
```
Выполнить создание рабочего пространство для основного приложения crm-simple:
```bash
$ npx ng new crm-simple --directory=. --routing=true --style=scss
```
- `ng new crm-simple` - создать новое приложение
- `--directory=.` - в текущем каталоге
- `--routing=true` - генерировать модуль routing
- `--style=scss` - использовать preprocessor 'scss'

В результате будет создано рабочее пространство и основное приложение crm-simple. В дополнительных приложениях будет функциональность, которая будет сопоставляться с конкретным пунктом глобального меню. И это дополнительное приложение будет загружаться ленивой загрузкой. В отдельных библиотеках можно хранить общие компоненты, службы и другие сущности. Глобальное меню отображается на уровне основного приложения crm-simple.

Создаем компонент навигации основного приложения nav:
```bash
$ npx ng generate component nav
```
В дальнейшем, в этом компоненте будет отображаться глобальное меню всего приложения.

Модифицируем app.component основного приложения:\
_./src/app/app.component.html_
```html
<app-nav></app-nav>
<br/><br/>
<router-outlet></router-outlet>
```
Теперь можем проверить работоспособность всего приложения.\
Запустить основное приложение можно командой:
```bash
$ npx ng serve --port 4250
```
- `--port 4250` - указывает номер порта (не обязательно, по умолчанию 4200)

Если была установлена глобальная версия angular/cli, то запустить основное приложение можно командой:
```bash
$ ng serve --port 4250
```
И проверить в браузере по ссылке: http://localhost:4250

### Создаем приложение _app-client_.

После создания основного приложения crm-simple требуется создать дополнительное приложение app-client для работы с клиентами. Это дополнительное приложение будет соответствовать главному пункту меню 'Клиенты' и содержать функциональность работы с клиентами.

Данное дополнительное приложение не зависит от остальных таких же дополнительных приложений.

Для продолжения переходим в каталог основного приложения:
```bash
$ cd /home/alexey/ws_ts3/crm-simple1/
```
Выполнить создание дополнительного приложения по работе с клиентами.
```bash
$ npx ng generate application app-client --routing=true --style=scss
```
- `ng generate application <name>` - создание нового приложения `<name>` в projects подкаталоге рабочей области;
- `--style=scss` - устанавливает препроцессор SCSS, который будет использоваться для файлов стилей (по умолчанию CSS);
- `--routing=true` - сообщает Angular CLI о необходимости создания NgModule маршрутизации;

Для запуска данного дополнительного приложения требуется выполнить:
```bash
$ npx ng serve app-client --port 4251
```
- `app-client` - название проекта, который нужно стартовать;
- `--port 4251` - номер порта для прослушивания (не обязательно);

И в браузере проверить по ссылке: http://localhost:4251

Далее создаем компонент для отображения списка клиентов.

Создаем модуль и компонент client-list:
```bash
$ npx ng generate module client-list --project=app-client
$ npx ng generate component client-list --project=app-client --export=true
```
Далее создаем компонент для отображения свойств клиента.

Создаем модуль и компонент client-view:
```bash
$ npx ng generate module client-view --project=app-client
$ npx ng generate component client-view --project=app-client --export=true
```
Создаем компонент навигации nav:
```bash
$ npx ng generate component nav --project=app-client
```
Сразу опишем переходы между списком клиентов и свойств клиента в компоненте навигации nav.component.\
_./projects/app-client/src/app/nav/nav.component.html_
```html
<a routerLink="/app-client/list">Client List</a> |
<a routerLink="/app-client/view">Client View</a>
```
 Компонент app дополнительного приложения должен отображать свое навигационное меню.

Модифицируем app.component:\
_./projects/app-client/src/app/app.component.html_
```html
<app-nav></app-nav>
<router-outlet></router-outlet>
```
 В модуль дополнительного приложения app.module требуется добавить наши новые модули:
- `ClientListModule` модуль отображения списка клиентов;
- `ClientViewModule` модуль отображения свойств клиента;

Модифицируем app.module:\
_./projects/app-client/src/app/app.module.ts_
```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';

import { ClientListModule } from './client-list/client-list.module';
import { ClientViewModule } from './client-view/client-view.module';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClientListModule,
    ClientViewModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
В модуль переходов дополнительного приложения app-routing.module требуется добавить переходы на наши новые компоненты.

Модифицируем app-routing.module:\
_./projects/app-client/src/app/app-routing.module.ts_
```ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientViewComponent } from './client-view/client-view.component';

const itemRoutes: Routes = [
  { path: 'list', component: ClientListComponent },
  { path: 'view', component: ClientViewComponent },
  { path: '**', redirectTo: 'list' }
];

const routes: Routes = [
  { path: 'app-client', component: AppComponent, children: itemRoutes }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

### Добавить переход на дополнительное приложение _app-client_.

Имеется рабочее пространство с основным приложением crm-simple и дополнительным приложением app-client. Теперь требуется организовать загрузку дополнительного приложения app-client из основного приложения.

Первоначально для импорта использовался абсолютный путь:
```ts
import * as AppClient from 'projects/app-client/src/app/app.module';
```
но при старте приложения на сайте _StackBlitz_ возникла ошибка:
```html
Import error, can't find file:
/src/projects/app-client/src/app/app.module
```
Оказалось, что на сайте _StackBlitz_ нельзя использовать абсолютный путь при импорте.
По данной причине для импорта _app-client_ использовался относительный путь.

Дополнительное приложение app-client должно загружаться ленивой загрузкой.

Модифицируем app-routing.module основного приложения:\
_./src/app/app-routing.module.ts_
```ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import * as AppClient from './../../projects/app-client/src/app/app.module';

const routes: Routes = [
  { path: 'app-client', loadChildren: './../../projects/app-client/src/app/app.module#AppModule' },
  { path: '**', redirectTo: '/app-client' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    AppClient.AppModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```
Добавим первый элемент глобального меню 'Clients'.

Модифицируем nav.component основного приложения:\
_./src/app/nav/nav.component.html_
```html
<p>nav works!</p>
<a [routerLink]="['/app-client']" [routerLinkActive]="['active']">Clients</a>
```
Запустим и проверим работоспособность всего приложения командой:
```bash
$ npx ng serve --port 4250
```
И в браузере проверить по ссылке: http://localhost:4250

В результате работает глобальное меню 'Clients'.

И его подменю 'Client List'

![alt](https://github.com/alx-melnichuk/crm-simple1/blob/master/img1-client-list.png)

И его подменю 'Client View'

![alt](https://github.com/alx-melnichuk/crm-simple1/blob/master/img1-client-view.png)

### Создаем приложение _app-task_.

Создадим дополнительное приложение app-task для работы с задачами. Это дополнительное приложение будет соответствовать главному пункту меню 'Задачи' и содержать функциональность работы с задачами.

Данное дополнительное приложение не зависит от остальных таких же дополнительных приложений.

Для продолжения переходим в каталог основного приложения:
```bash
$ cd /home/alexey/ws_ts3/crm-simple1/
```
Выполнить создание отдельного приложения по работе с задачами.
```bash
$ npx ng generate application app-task --routing=true --style=scss
```
- `ng generate application <name>` - создание нового приложения `<name>` в projects подкаталоге рабочей области;
- `--style=scss` - устанавливает препроцессор SCSS, который будет использоваться для файлов стилей (по умолчанию CSS);
- `--routing=true` - сообщает Angular CLI о необходимости создания NgModule маршрутизации;

Для запуска данного дополнительного приложения требуется выполнить:
```bash
$ npx ng serve app-task --port 4252
```
- `app-task` - название проекта, который нужно стартовать;
- `--port 4252` - номер порта для прослушивания (не обязательно);

И в браузере проверить по ссылке: http://localhost:4252

Далее создаем компонент для отображения списка задач.

Создаем модуль и компонент task-list:
```bash
$ npx ng generate module task-list --project=app-task
$ npx ng generate component task-list --project=app-task --export=true
```
Далее создаем компонент для отображения свойств задачи.

Создаем модуль и компонент task-view:
```bash
$ npx ng generate module task-view --project=app-task
$ npx ng generate component task-view --project=app-task --export=true
```
Создаем компонент навигации nav:
```bash
$ npx ng generate component nav --project=app-task
```
Сразу опишем переходы между списком задач и свойствами задачи.\
_./projects/app-task/src/app/nav/nav.component.html_
```html
<a routerLink="/app-task/list">Task List</a> |
<a routerLink="/app-task/view">Task View</a>
```
Компонент app дополнительного приложения должен отображать свое навигационное меню.

Модифицируем app.component:\
_./projects/app-task/src/app/app.component.html_
```html
<app-nav></app-nav>
<router-outlet></router-outlet>
```
В модуль дополнительного приложения app.module требуется добавить наши новые модули:
- `TaskListModule` модуль отображения списка задач;
- `TaskViewModule` модуль отображения свойств задачи;

Модифицируем app.module:\
_./projects/app-task/src/app/app.module.ts_
```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { TaskListModule } from './task-list/task-list.module';
import { TaskViewModule } from './task-view/task-view.module';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TaskListModule,
    TaskViewModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
В модуль переходов дополнительного приложения app-routing.module требуется добавить переходы на наши новые компоненты.

Модифицируем app-routing.module:\
_./projects/app-task/src/app/app-routing.module.ts_
```ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskViewComponent } from './task-view/task-view.component';

const itemRoutes: Routes = [
  { path: 'list', component: TaskListComponent },
  { path: 'view', component: TaskViewComponent },
  { path: '**', redirectTo: 'list' }
];

const routes: Routes = [
  { path: 'app-task', component: AppComponent, children: itemRoutes }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

### Добавить переход на дополнительное приложение _app-task_.

Имеется рабочее пространство с основным приложением _crm-simple_ и двумя дополнительными приложениями _app-client_ и _app-task_. Теперь требуется организовать загрузку дополнительного приложения _app-task_ из основного приложения.

Дополнительное приложение _app-task_ должно загружаться ленивой загрузкой.

Модифицируем app-routing.module основного приложения:\
_./src/app/app-routing.module.ts_
```ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import * as AppClient from './../../projects/app-client/src/app/app.module';
import * as AppTask from './../../projects/app-task/src/app/app.module';

const routes: Routes = [
  { path: 'app-client', loadChildren: './../../projects/app-client/src/app/app.module#AppModule' },
  { path: 'app-task', loadChildren: './../../projects/app-task/src/app/app.module#AppModule' },
  { path: '**', redirectTo: '/app-client' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    AppClient.AppModule,
    AppTask.AppModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```
Добавим второй элемент глобального меню 'Tasks'.

Модифицируем nav.component основного приложения:\
_./src/app/nav/nav.component.html_
```html
<p>nav works!</p>
<a [routerLink]="['/app-client']" [routerLinkActive]="['active']">Clients</a> |
<a [routerLink]="['/app-task']" [routerLinkActive]="['active']">Tasks</a>
```

### Ленивая загрузка дополнительных приложений.

Посмотрим как загружаются наши дополнительные приложения. Для этого добавим в конструктор _app.module.ts_ для _app-client_ и _app-task_ вывод в консоль.
```ts
export class AppModule {
  constructor() {
    console.log('AppModule app-client');
  }
}
```
И после старта основного приложения посмотрим в консоль. И там увидим, что при старте сразу загружаются оба наших дополнительных приложения. Давайте разберемся почему так происходит.

Рассмотрим понятие _рабочее пространство_. Простыми словами - это единая область для нескольких приложений. Каталог _node_modules_ используется всеми приложениями - а это экономит дисковое пространство. В _рабочем пространстве_ может храниться основное приложение в каталоге _src_. В каталоге _projects_ находятся дополнительные приложения. При этом они являются полноценными приложениями. И их можно запускать по отдельности, каждое на своем порту. _Рабочее пространство_ консолидирует несколько приложений в одном месте.

Согласно требований документации [https://angular.io/api/router/LoadChildrenCallback](https://angular.io/api/router/LoadChildrenCallback) выполним изменения в описании модулей ленивой загрузки.\
_/src/app/app-routing.module.ts_
```ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'app-client',
    loadChildren: () => import('../../projects/app-client/src/app/app.module').then(mod => mod.AppModule),
  },
  {
    path: 'app-task',
    loadChildren: () => import('../../projects/app-task/src/app/app.module').then(mod => mod.AppModule),
  },
  { path: '**', redirectTo: '/app-client/list' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```
Однако после этого в редакторе кода _VSCode_ возникла ошибка:
```
Dynamic import is only supported when '--module' flag is 'commonjs' or 'esNext'.ts (1323)
```
Что бы исправить данную ошибку открываем файл ./tsconfig.json и меняем строку:
`"module": "es2020"` на новое значение `"module": "esNext"`.

После этого посмотрим в консоль, а там ошибка: "Error: BrowserModule has already been loaded." Так как дополнительные приложения являются полноправными приложениями, то в них используется _imports: [BrowserModule]_ и _bootstrap: [AppComponent]_. Давайте отключим эти две настройки.

_/projects/app-client/src/app/app.module.ts_
```ts
// import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';

import { ClientListModule } from './client-list/client-list.module';
import { ClientViewModule } from './client-view/client-view.module';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent
  ],
  imports: [
    // BrowserModule,
    AppRoutingModule,
    ClientListModule,
    ClientViewModule
  ],
  providers: [],
  // bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    console.log('AppModule app-client');
  }
}
```
Соответственно, такие же исправления и для дополнительного приложения _app-task_.

Теперь при старте основного приложения ошибок нет. А вот при выборе маршрута в консоль падает ошибка: "Error: RouterModule.forRoot() called twice. Lazy loaded modules should use RouterModule.forChild() instead."
Внесем исправления: заменим _RouterModule.forRoot()_ на _RouterModule.forChild()_.\
_/projects/app-client/src/app/app-routing.module.ts_
```ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientViewComponent } from './client-view/client-view.component';

const itemRoutes: Routes = [
  { path: 'list', component: ClientListComponent },
  { path: 'view', component: ClientViewComponent },
  { path: '**', redirectTo: 'list' }
];

const routes: Routes = [
  { path: '', component: AppComponent, children: itemRoutes }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```
Соответственно, такие же исправления и для дополнительного приложения _app-task_.

Выполним проверку в браузере. При старте, если не задан адрес, то выполняется переход на _/app-client/list_. И мы видим в консоле, что при старте загружается модуль _AppModule app-client_. А это модуль, в котором содержится вся функциональность дополнительного приложения _app-client_). Если переходим по ссылке _/app-task_, то в консоле видно, что загружается модуль _AppModule app-task_. Следует отметить, что после того как модуль был загружен в память, то он там и остается.

В описании маршрутов можно добавить параметр _canLoad_, в котором проверять разрешения пользователя на загрузку данного дополнительного модуля.

Таким образом мы добились требуемого результата - дополнительные приложения загружаются по ленивой загрузке. Точнее, это уже не дополнительные приложения, а дополнительные модули.


Запустим и проверим как работает основное приложение:
```bash
$ npx ng serve --port 4250
```
И в браузере проверить по ссылке: http://localhost:4250

В результате работает второе глобальное меню 'Tasks'.

И его подменю 'Task List'

![alt](https://github.com/alx-melnichuk/crm-simple1/blob/master/img1-task-list.png)

И его подменю 'Task View'

![alt](https://github.com/alx-melnichuk/crm-simple/blob/master/img1-task-view.png)

Исходный код можно скачать [github-crm-simple1](https://github.com/alx-melnichuk/crm-simple1). (Запустите `npm install` перед запуском приложения.)

Запустить проект на сайте _StackBlitz_ можно по ссылке [https://stackblitz.com/github/alx-melnichuk/crm-simple1](https://stackblitz.com/github/alx-melnichuk/crm-simple1)

### Анализ полученного результата.

В результате проделанной работы выполнены следующие задачи:
- Создан каркас программного комплекса (основное приложение), как комбинация дополнительных приложений;
- Функциональность дополнительных приложений передается в основное приложение;
- Каждому пункту глобального меню соответствует дополнительный модуль;
- Каждый дополнительный модуль загружается ленивой загрузкой;
- Каждый дополнительный модуль не зависит от других дополнительных модулей;
