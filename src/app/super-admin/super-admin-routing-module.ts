import { Layout } from './../shared/layout/layout';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperAdminDashboard } from './components/super-admin-dashboard/super-admin-dashboard';
import { WarehouseManagement } from './components/warehouse-management/warehouse-management';

const routes: Routes = [
   {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: SuperAdminDashboard },
      { path: 'warehouses', component: WarehouseManagement }
      // add other super-admin routes here
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperAdminRoutingModule { }
