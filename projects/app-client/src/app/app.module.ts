import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
    CommonModule,
    AppRoutingModule,
    ClientListModule,
    ClientViewModule
  ],
  providers: [],
})
export class AppModule {
  constructor() {
    console.log('AppModule app-client');
  }
}
