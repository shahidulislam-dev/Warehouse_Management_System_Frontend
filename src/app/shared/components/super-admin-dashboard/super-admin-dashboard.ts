import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth-service';
import { WarehouseService } from '../../../services/warehouse-service';
import { UserService } from '../../../services/user-service';
import { Router } from '@angular/router';
import { GlobalToastrService } from '../../../services/global-toastr-service';

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: false,
  templateUrl: './super-admin-dashboard.html',
  styleUrl: './super-admin-dashboard.css'
})
export class SuperAdminDashboard implements OnInit{
  userCount: number = 0;
  warehouseCount: number = 0;
  pendingApprovals: number = 0;
  isLoading = true;

  constructor(
    public authService: AuthService,
    private warehouseService: WarehouseService,
    private userService: UserService,
    private router: Router,
    private toastr: GlobalToastrService 
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    
    // Load users data (only for admin/super-admin)
    if (this.authService.canManageUsers()) {
      this.userService.getAllUsers().subscribe({
        next: (users) => {
          this.userCount = users.length;
          this.pendingApprovals = users.filter(user => user.status === 'false').length;
          this.isLoading = false;
          this.toastr.success('Dashboard data loaded successfully');
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.isLoading = false;
          this.toastr.error('Failed to load user data');
        }
      });
    } else {
      this.isLoading = false;
    }

    // Load warehouses data (for all roles)
    this.warehouseService.getAllWarehouses().subscribe({
      next: (warehouses) => {
        this.warehouseCount = warehouses.length;
      },
      error: (error) => {
        console.error('Error loading warehouses:', error);
        this.toastr.error('Failed to load warehouse data');
      }
    });
  }

  getDashboardRoute(): string {
    return this.authService.getDashboardRoute();
  }

  refreshDashboard(): void {
    this.toastr.warning('Refreshing dashboard data...');
    this.loadDashboardData();
  }
}