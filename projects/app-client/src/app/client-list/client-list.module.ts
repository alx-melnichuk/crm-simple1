import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientListComponent } from './client-list.component';



@NgModule({
  declarations: [ClientListComponent],
  imports: [
    CommonModule
  ],
  exports: [ClientListComponent]
})
export class ClientListModule { }
