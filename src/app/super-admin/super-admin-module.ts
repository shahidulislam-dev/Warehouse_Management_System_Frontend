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
import { FloorManagement } from './components/floor-management/floor-management';
import { CreateFloor } from './components/floor-management/create-floor/create-floor';
import { RoomsManagement } from './components/rooms-management/rooms-management';
import { CreateRoom } from './components/rooms-management/create-room/create-room';
import { GoodsManagement } from './components/goods-management/goods-management';
import { CreateGoods } from './components/goods-management/create-goods/create-goods';


@NgModule({
  declarations: [
    SuperAdminDashboard,
    WarehouseManagement,
    CreateWarehouse,
    FloorManagement,
    CreateFloor,
    RoomsManagement,
    CreateRoom,
    GoodsManagement,
    CreateGoods
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
