// admin-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from '../shared/layout/layout';
import { SuperAdminDashboard } from '../shared/components/super-admin-dashboard/super-admin-dashboard';
import { UserManagement } from '../shared/components/user-management/user-management';
import { WarehouseManagement } from '../shared/components/warehouse-management/warehouse-management';
import { FloorManagement } from '../shared/components/floor-management/floor-management';
import { RoomsManagement } from '../shared/components/rooms-management/rooms-management';
import { CategoryManagement } from '../shared/components/category-management/category-management';
import { GoodsManagement } from '../shared/components/goods-management/goods-management';

const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: SuperAdminDashboard },
      { path: 'users', component: UserManagement },
      { path: 'warehouses', component: WarehouseManagement },
      { path: 'floors', redirectTo: 'floors/all', pathMatch: 'full' },
      { path: 'floors/all', component: FloorManagement },
      { path: 'floors/warehouse/:warehouseId', component: FloorManagement },
      { path: 'rooms', redirectTo: 'rooms/all', pathMatch: 'full' },
      { path: 'rooms/all', component: RoomsManagement },
      { path: 'rooms/warehouse/:warehouseId', component: RoomsManagement },
      { path: 'rooms/warehouse/:warehouseId/floor/:floorId', component: RoomsManagement },
      { path: 'goods-category', component: CategoryManagement },
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
export class AdminRoutingModule { }