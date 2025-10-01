import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperAdminRoutingModule } from './super-admin-routing-module';
import { SuperAdminDashboard } from './components/super-admin-dashboard/super-admin-dashboard';
import { WarehouseManagement } from './components/warehouse-management/warehouse-management';
import { MetarialModule } from "../shared/metarial/metarial-module";
import { SharedModule } from '../shared/shared-module';
import { MatButtonModule } from '@angular/material/button';
import { CreateWarehouse } from './components/warehouse-management/create-warehouse/create-warehouse';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SuperAdminDashboard,
    WarehouseManagement,
    CreateWarehouse
  ],
  imports: [
    CommonModule,
    SuperAdminRoutingModule,
    MetarialModule,
    MatButtonModule,
    SharedModule,
    ReactiveFormsModule
]
})
export class SuperAdminModule { }
