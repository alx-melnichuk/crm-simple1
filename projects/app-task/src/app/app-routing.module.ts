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
  { path: '', component: AppComponent, children: itemRoutes }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
