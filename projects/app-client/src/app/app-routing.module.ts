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
