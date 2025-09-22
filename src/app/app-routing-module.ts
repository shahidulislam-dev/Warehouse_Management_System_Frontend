import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth-guard';

const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },

  // Lazy-loaded modules
  { path: 'auth', loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule) },
  
  // Admin routes
  { 
    path: 'admin', 
    loadChildren: () => import('./admin/admin-module').then(m => m.AdminModule), 
    canActivate: [AuthGuard], 
    data: { roles: ['admin'] } 
  },
  
  // Super Admin routes
  { 
    path: 'super-admin', 
    loadChildren: () => import('./super-admin/super-admin-module').then(m => m.SuperAdminModule), 
    canActivate: [AuthGuard], 
    data: { roles: ['super-admin'] } 
  },
  
  // User routes (for staff)
  { 
    path: 'user', 
    loadChildren: () => import('./user/user-module').then(m => m.UserModule), 
    canActivate: [AuthGuard], 
    data: { roles: ['staff'] } 
  },

  // Wildcard redirect
  { path: '**', redirectTo: '/auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}