import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperAdminRoutingModule } from './super-admin-routing-module';
import { SuperAdminDashboard } from './components/super-admin-dashboard/super-admin-dashboard';
import { WarehouseManagement } from './components/warehouse-management/warehouse-management';
import { MetarialModule } from "../shared/metarial/metarial-module";


@NgModule({
  declarations: [
    SuperAdminDashboard,
    WarehouseManagement
  ],
  imports: [
    CommonModule,
    SuperAdminRoutingModule,
    MetarialModule
]
})
export class SuperAdminModule { }
