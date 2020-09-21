import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
    CommonModule,
    AppRoutingModule,
    TaskListModule,
    TaskViewModule
  ],
  providers: [],
})
export class AppModule {
  constructor() {
    console.log('AppModule app-task');
  }
}
