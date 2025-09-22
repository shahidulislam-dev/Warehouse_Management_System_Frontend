import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing-module';
import { UserDashboard } from './components/user-dashboard/user-dashboard';


@NgModule({
  declarations: [
    UserDashboard
  ],
  imports: [
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }
