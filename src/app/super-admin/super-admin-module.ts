import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperAdminRoutingModule } from './super-admin-routing-module';
import { SuperAdminDashboard } from './components/super-admin-dashboard/super-admin-dashboard';


@NgModule({
  declarations: [
    SuperAdminDashboard
  ],
  imports: [
    CommonModule,
    SuperAdminRoutingModule
  ]
})
export class SuperAdminModule { }
