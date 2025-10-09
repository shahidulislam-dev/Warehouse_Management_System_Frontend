import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing-module';
import { UserDashboard } from './components/user-dashboard/user-dashboard';
import { SharedModule } from '../shared/shared-module';


@NgModule({
  declarations: [
    UserDashboard
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule
  ]
})
export class UserModule { }
