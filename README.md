
>Article in Russian [README_ru.md](https://github.com/alx-melnichuk/crm-simple1/blob/master/README_ru.md)

## Combine multiple Angular applications into one complex. (part 1)

### Introduction

A situation often arises when a company develops a large software package with a large amount of functionality. And at the same time, the marketing department sets the task: to provide customers with not all the functionality at once, but only the part that he needs (which was paid). In other words, the software package must be modular.

For example, one item of the global menu is one business module with functionality for working with clients. In which it is implemented: creating, editing, deleting a client, displaying client nesting, grouping clients by category, and so on.
The second item of the global menu is the second business module with functionality for working with goods. Etc. At the same time, business modules should be independent from each other, so that you can quickly disconnect the business module, or vice versa, quickly connect the business module.

It turns out that the software package is a 'constructor' that is assembled from the business modules required for a given client. This approach will make it possible to form a large number of programs with a different set of functional business modules. And this will allow you to attract more clients.

However, in practice, the requirement for independence of each business module is not met. Because the development team changes in the process of creating a software package. At the same time, the human factor cannot be excluded: 'I did not know' or 'it was faster and easier that way'. The entities of one business module (classes, services, components, and so on) are embedded in another business module. And these business modules become connected and affect one another. Changes in the first business module entail changes in other business modules that depend on it. The software complex turns into a 'clumsy monster'. The time for developing and testing functionality increases, since it is required to take into account the existing dependencies between the modules. The company spends more time and money on maintaining this software package. And after a short period of time, the company loses customers.

In Angular it is possible to create one application that includes other applications. Examples of this approach can be found in the article '[Combining Multiple Angular Applications into a Single One](https://medium.com/disney-streaming/combining-multiple-angular-applications-into-a-single-one-e87d530d6527)' и '[Angular workspaces: multi-application projects](https://octoperf.com/blog/2019/08/22/kraken-angular-workspace-multi-application-project/)'.

Let's create an Angular application with independent applications (projects) in one main application.

### Preconditions

Angular requires Node.js version 10.9.0 or later. Run: 'node -v' to check the current version. (used: 'v12.18.2'). You can download NodeJS from [nodejs.org] (https://nodejs.org/en/) or install it using [Package Manager](https://nodejs.org/en/download/package-manager/).

Angular applications depend on external libraries available as npm packages. The npm package manager is available in Node.js. Run: 'npm -v' to check the npm version. (used: '6.14.8'). Update npm to the latest available version using the command 'npm install -g npm @ latest'.

### Install locally @angular/cli

Create a directory for the project and go to it:
```bash
$ mkdir /home/alexey/ws_ts3/crm-simple0/
$ cd /home/alexey/ws_ts3/crm-simple0/
```
Install locally required @angular/cli version (Angular 10 version was used):
```bash
$ npm install @angular/cli@10
```
You can install the latest version locally:
```bash
$ npm install @angular/cli@latest
```
As a result, a new 'node_modules' subdirectory appears in the current directory, which contains the required @angular/cli version.

In what follows we will use the **npx** program. This is a program that is automatically installed with **node** and **npm** version 5.2.0 and higher. It allows you to use locally installed tools without installing them globally. **npx** runs **ng** from a local directory ./node_modules/@angular/cli/bin/ng. This utility modifies the $ PATH for a specific invocation by adding the path './node_modules/.bin' there. That is why locally installed programs start working.
The **npx** program has the following format:
```bash
$ npx <here any program installed as local npm package> <here are the options of this program>
```
### Create workspace

The [ng new](https://angular.io/cli/new) command creates the _Angular workspace_ folder and a new application skeleton. A workspace can contain multiple applications and libraries. The main application created by the `ng new` command is at the top level of the workspace in the `src` directory. When you create an additional application or library in the workspace, it goes into the `projects` subfolder under its name. Each additional application has a `src` directory that contains logic, data, and assets.

To continue, go to the main application directory:
```bash
$ cd /home/alexey/ws_ts3/crm-simple0/
```
Create a workspace for the main crm-simple application:
```bash
$ npx ng new crm-simple --directory=. --routing=true --style=scss
```
- `ng new crm-simple` - create a new application
- `--directory=.` - in the current directory
- `--routing=true` - generate module routing
- `--style=scss` - use preprocessor 'scss'

This will create a workspace and a main crm-simple application. Additional applications will have functionality that will map to a specific global menu item. And this additional application will be lazy loaded. Separate libraries can store shared components, services, and other entities. The global menu is displayed at the level of the main application crm-simple.

Create a navigation component for the main nav application:
```bash
$ npx ng generate component nav
```
In the future, this component will display the global menu of the entire application.

Modifying the app.component of the main application:\
_./src/app/app.component.html_
```html
<app-nav></app-nav>
<br/><br/>
<router-outlet></router-outlet>
```
Now we can check the functionality of the entire application.\
You can start the main application with the command:
```bash
$ npx ng serve --port 4250
```
- `--port 4250` - specifies the port number (optional, default 4200)

If the global version of angular / cli was installed, then you can start the main application with the command:
```bash
$ ng serve --port 4250
```
And check in the browser at the link: http://localhost:4250

### We create the _app-client_ application.

After creating the main crm-simple application, you need to create an additional app-client application to work with clients. This additional application will correspond to the main menu item 'Clients' and will contain the functionality of working with clients.

This additional application does not depend on other such additional applications.

To continue, go to the main application directory:
```bash
$ cd /home/alexey/ws_ts3/crm-simple0/
```
Create an additional application for working with clients.
```bash
$ npx ng generate application app-client --routing=true --style=scss
```
- `ng generate application <name>` - creating a new application `<name>` in the projects subdirectory of the workspace;
- `--style=scss` - sets the SCSS preprocessor to be used for style files (default CSS);
- `--routing=true` -tells Angular CLI to create a routing NgModule;

To run this additional application, you need to do:
```bash
$ npx ng serve app-client --port 4251
```
- `app-client` - the name of the project to start;
- `--port 4251` - listening port number (optional);

And check the link in the browser: http://localhost:4251

Next, we create a component to display a list of customers.

We create a module and a client-list component:
```bash
$ npx ng generate module client-list --project=app-client
$ npx ng generate component client-list --project=app-client --export=true
```
Next, we create a component to display client properties.

We create a module and a client-view component:
```bash
$ npx ng generate module client-view --project=app-client
$ npx ng generate component client-view --project=app-client --export=true
```
Create a nav navigation component:
```bash
$ npx ng generate component nav --project=app-client
```
Let's immediately describe the transitions between the list of clients and client properties in the nav.component navigation component.\
_./projects/app-client/src/app/nav/nav.component.html_
```html
<a routerLink="/app-client/list">Client List</a> |
<a routerLink="/app-client/view">Client View</a>
```
The app component of the add-on app should render its navigation menu.

Modifying app.component:\
_./projects/app-client/src/app/app.component.html_
```html
<app-nav></app-nav>
<router-outlet></router-outlet>
```

We need to add our new modules to the app.module additional application module:
- `ClientListModule` module for displaying a list of clients;
- `ClientViewModule` module for displaying client properties;

Modifying app.module:\
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
The navigation module of the additional application app-routing.module needs to add transitions to our new components.

Let's modify the app-routing.module:\
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

### Add transition to additional application _app-client_.

There is a workspace with a main _crm-simple_ application and an additional _app-client_ application. Now we need to organize the loading of the additional _app-client_ application from the main application.

Originally the absolute path was used for import:
```ts
import * as AppClient from 'projects/app-client/src/app/app.module';
```
but when starting the application on the _StackBlitz_ site, an error occurred:
```html
Import error, can't find file:
/src/projects/app-client/src/app/app.module
```
It turned out that on the _StackBlitz_ site you cannot use an absolute path when importing.
For this reason, a relative path was used to import the AppClient.

The additional _app-client_ application should be lazy loaded.

Let's modify the app-routing.module of the main application:\
_./src/app/app-routing.module.ts_
```ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import * as AppClient from '../../projects/app-client/src/app/app.module';

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
Let's add the first item of the global menu 'Clients'.

Let's modify the nav.component of the main application:\
_./src/app/nav/nav.component.html_
```html
<p>nav works!</p>
<a [routerLink]="['/app-client']" [routerLinkActive]="['active']">Clients</a>
```
Let's start and check the performance of the entire application with the command:
```bash
$ npx ng serve --port 4250
```
And check the link in the browser: http://localhost:4250

As a result, the global menu 'Clients' works.

And its submenu 'Client List'

![alt](https://github.com/alx-melnichuk/crm-simple1/blob/master/img1-client-list.png)

And its submenu 'Client View'

![alt](https://github.com/alx-melnichuk/crm-simple1/blob/master/img1-client-view.png)

### We create the _app-task_.

Let's create an additional app-task application for working with tasks. This additional application will correspond to the main menu item 'Tasks' and contain the functionality of working with tasks.

This additional application does not depend on other such additional applications.

To continue, go to the main application directory:
```bash
$ cd /home/alexey/ws_ts3/crm-simple0/
```
Create a separate application for working with tasks.
```bash
$ npx ng generate application app-task --routing=true --style=scss
```
- `ng generate application <name>` - creating a new application `<name>` in the projects subdirectory of the workspace;
- `--style=scss` - sets the SCSS preprocessor to be used for style files (default CSS);
- `--routing=true` - tells Angular CLI to create a routing NgModule;

To run this additional application, you need to do:
```bash
$ npx ng serve app-task --port 4252
```
- `app-task` - the name of the project to start;
- `--port 4252` - listening port number (optional);

And check the link in the browser: http://localhost:4252

Next, we create a component to display a list of tasks.

Create a module and a task-list component:
```bash
$ npx ng generate module task-list --project=app-task
$ npx ng generate component task-list --project=app-task --export=true
```
Next, we create a component to display task properties.

Create a module and a task-view component:
```bash
$ npx ng generate module task-view --project=app-task
$ npx ng generate component task-view --project=app-task --export=true
```
Create a nav navigation component:
```bash
$ npx ng generate component nav --project=app-task
```
Let's immediately describe the transitions between the task list and task properties.\
_./projects/app-task/src/app/nav/nav.component.html_
```html
<a routerLink="/app-task/list">Task List</a> |
<a routerLink="/app-task/view">Task View</a>
```
The app component of the add-on app should render its navigation menu.

Modifying app.component:\
_./projects/app-task/src/app/app.component.html_
```html
<app-nav></app-nav>
<router-outlet></router-outlet>
```
We need to add our new modules to the app.module additional application module:
- `TaskListModule` module for displaying the list of tasks;
- `TaskViewModule` module for displaying task properties;

Modifying app.module:\
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
The navigation module of the additional application app-routing.module needs to add transitions to our new components.

Let's modify the app-routing.module:\
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

### Add transition to additional application _app-task_.

There is a workspace with the main _crm-simple_ application and two additional applications _app-client_ and _app-task_. Now we need to organize the loading of the additional application _app-task_ from the main application.

The additional app-task must be lazy loaded.

Let's modify the app-routing.module of the main application:\
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
Let's add the second item of the global menu 'Tasks'.

Let's modify the nav.component of the main application:\
_./src/app/nav/nav.component.html_
```html
<p>nav works!</p>
<a [routerLink]="['/app-client']" [routerLinkActive]="['active']">Clients</a> |
<a [routerLink]="['/app-task']" [routerLinkActive]="['active']">Tasks</a>
```

### Lazy loading of additional applications.

Let's see how our additional applications are loaded. To do this, add console output to the _app.module.ts_ constructor for _app-client_ and _app-task_.
```ts
export class AppModule {
  constructor() {
    console.log('AppModule app-client');
  }
}
```
And after starting the main application, let's look at the console. And there we will see that at startup both of our additional applications are loaded at once. Let's see why this is happening.

Let's consider the concept of _workspace_. In simple words, it is a single area for several applications. The _node_modules_ directory is used by all applications, which saves disk space. The _workspace_ can store the main application in the _src_ directory. The _projects_ directory contains additional applications. Moreover, they are full-fledged applications. And they can be run individually, each on its own port. _Workspace_ consolidates multiple applications in one place.

According to the documentation requirements [https://angular.io/api/router/LoadChildrenCallback](https://angular.io/api/router/LoadChildrenCallback) let's make changes to the description of lazy loading modules.\
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
However, after that, an error occurred in the _VSCode_ code editor:
```
Dynamic import is only supported when '--module' flag is 'commonjs' or 'esNext'.ts (1323)
```
To fix this error, open the file ./tsconfig.json and change the line:
`"module": "es2020"` на новое значение `"module": "esNext"`.

After that, let's look at the console, and there is an error: "Error: BrowserModule has already been loaded." Since additional applications are full-fledged applications, they use _imports: [BrowserModule] _ and _bootstrap: [AppComponent] _. Let's disable these two settings.

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
    AppRoutingModule  ,
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
Accordingly, the same fixes for the additional application _app-task_.

Now there are no errors when starting the main application. But when choosing a route, an error falls into the console: "Error: RouterModule.forRoot() called twice. Lazy loaded modules should use RouterModule.forChild() instead."
Let's make some corrections: replace _RouterModule.forRoot ()_ with _RouterModule.forChild ()_.

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
Accordingly, the same fixes for the additional application _app-task_.

Let's check in the browser. At startup, if the address is not specified, then the transition to _/app-client/list_ is performed. And we see in the console that the _AppModule app-client_ module is loaded at startup. And this is a module that contains all the functionality of the additional application _app-client_). If we follow the link _/app-task_, then in the console you can see that the _AppModule app-task_ module is being loaded. It should be noted that after the module has been loaded into memory, it remains there.

In the description of the routes, you can add the _canLoad_ parameter, in which you can check the user's permissions to load this additional module.

Thus, we have achieved the desired result - additional applications are loaded by lazy loading. More precisely, these are no longer additional applications, but additional modules.


Let's start and check how the main application works:
```bash
$ npx ng serve --port 4250
```
And check the link in the browser: http://localhost:4250

As a result, the second global menu 'Tasks' works.

And its submenu 'Task List'

![alt](https://github.com/alx-melnichuk/crm-simple1/blob/master/img1-task-list.png)

And its submenu 'Task View'

![alt](https://github.com/alx-melnichuk/crm-simple1/blob/master/img1-task-view.png)

Source code can be downloaded [github-crm-simple1](https://github.com/alx-melnichuk/crm-simple1). (Run `npm install` before running the application.)

You can launch the project on the _StackBlitz_ website by following the link [https://stackblitz.com/github/alx-melnichuk/crm-simple1](https://stackblitz.com/github/alx-melnichuk/crm-simple1)

### Analysis of the obtained result.

As a result of the work done, the following tasks were completed:
- Created the framework of the software package (main application), as a combination of additional applications;
- The functionality of additional applications is transferred to the main application;
- Each item of the global menu corresponds to an additional module;
- Each additional module is loaded by lazy loading;
- Each additional module does not depend on other additional modules;