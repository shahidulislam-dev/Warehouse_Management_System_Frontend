import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetarialModule } from './metarial/metarial-module';
import { Layout } from './layout/layout';
import { Header } from './layout/header/header';
import { Sidebar } from './layout/sidebar/sidebar';
import { Content } from './layout/content/content';
import { RouterModule } from '@angular/router';
import { ConfirmDialog } from './confirm-dialog/confirm-dialog';
import { SuperAdminDashboard } from './components/super-admin-dashboard/super-admin-dashboard';
import { UserManagement } from './components/user-management/user-management';
import { WarehouseManagement } from './components/warehouse-management/warehouse-management';
import { FloorManagement } from './components/floor-management/floor-management';
import { RoomsManagement } from './components/rooms-management/rooms-management';
import { CategoryManagement } from './components/category-management/category-management';
import { GoodsManagement } from './components/goods-management/goods-management';
import { CreateUsers } from './components/user-management/create-users/create-users';
import { UpdateUserRole } from './components/user-management/update-user-role/update-user-role';
import { CreateWarehouse } from './components/warehouse-management/create-warehouse/create-warehouse';
import { CreateFloor } from './components/floor-management/create-floor/create-floor';
import { CreateRoom } from './components/rooms-management/create-room/create-room';
import { CreateCategory } from './components/category-management/create-category/create-category';
import { CreateGoods } from './components/goods-management/create-goods/create-goods';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
      Layout,
    Header,
    Sidebar,
    Content,
    ConfirmDialog,
    
    // Shared Management Components (with original names internally)
    SuperAdminDashboard,
    UserManagement,
    WarehouseManagement,
    FloorManagement,
    RoomsManagement,
    GoodsManagement,
    CategoryManagement,
    
    // Dialog Components
    CreateUsers,
    UpdateUserRole,
    CreateWarehouse,
    CreateFloor,
    CreateRoom,
    CreateGoods,
    CreateCategory
  ],
  imports: [
    CommonModule,
    MetarialModule,
    RouterModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    Layout,
    ConfirmDialog,
    SuperAdminDashboard,
    UserManagement,
    WarehouseManagement,
    FloorManagement,
    RoomsManagement,
    GoodsManagement,
    CategoryManagement
  ]
})
export class SharedModule { }
