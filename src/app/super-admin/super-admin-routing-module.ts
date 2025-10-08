import { Layout } from './../shared/layout/layout';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperAdminDashboard } from './components/super-admin-dashboard/super-admin-dashboard';
import { WarehouseManagement } from './components/warehouse-management/warehouse-management';
import { FloorManagement } from './components/floor-management/floor-management';
import { RoomsManagement } from './components/rooms-management/rooms-management';
import { GoodsManagement } from './components/goods-management/goods-management';
import { CategoryManagement } from './components/category-management/category-management';
import { UserManagement } from './components/user-management/user-management';

const routes: Routes = [
   {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: SuperAdminDashboard },
      { path: 'users', component: UserManagement },
      { path: 'warehouses', component: WarehouseManagement },
       // Flat routes for floors
      { path: 'floors', redirectTo: 'floors/all', pathMatch: 'full' },
      { path: 'floors/all', component: FloorManagement },
      { path: 'floors/warehouse/:warehouseId', component: FloorManagement },
      // Flat routes for rooms
      { path: 'rooms', redirectTo: 'rooms/all', pathMatch: 'full' },
      { path: 'rooms/all', component: RoomsManagement },
      { path: 'rooms/warehouse/:warehouseId', component: RoomsManagement },
      { path: 'rooms/warehouse/:warehouseId/floor/:floorId', component: RoomsManagement },
      { path: 'goods-category', component: CategoryManagement },
       // Flat routes for goods - FIXED ROUTING
      { path: 'goods', redirectTo: 'goods/all', pathMatch: 'full' },
      { path: 'goods/all', component: GoodsManagement },
      { path: 'goods/warehouse/:warehouseId', component: GoodsManagement },
      { path: 'goods/warehouse/:warehouseId/floor/:floorId', component: GoodsManagement },
      { path: 'goods/warehouse/:warehouseId/floor/:floorId/room/:roomId', component: GoodsManagement }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperAdminRoutingModule { }
