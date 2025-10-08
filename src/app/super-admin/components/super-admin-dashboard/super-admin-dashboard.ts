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
  isSidenavOpen = false;
  isLoading = true;

  constructor(
    private authService: AuthService,
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
    
    // Load users data
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.userCount = users.length;
        this.pendingApprovals = users.filter(user => user.status === 'false').length;
        this.isLoading = false;
        
        // Optional: Show success toast when data loads successfully
        this.toastr.success('Dashboard data loaded successfully');
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoading = false;
        this.toastr.error('Failed to load user data');
      }
    });

    // Load warehouses data
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

  toggleSidenav(): void {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  showUserMenu = false;

  // Toggle menu with JavaScript
  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  // Close menu when clicking elsewhere
  closeUserMenu(): void {
    this.showUserMenu = false;
  }

  logout(): void {
    this.authService.logout();
    this.toastr.success('Logged out successfully'); // Success toast for logout
    this.router.navigate(['/auth/login']);
    this.showUserMenu = false; 
  }

  // Optional: Add methods for other actions that might need toast notifications
  refreshDashboard(): void {
    this.toastr.warning('Refreshing dashboard data...'); // Warning toast for refresh
    this.loadDashboardData();
  }

  // Example method for handling pending approvals
  handlePendingApprovals(): void {
    if (this.pendingApprovals > 0) {
      this.toastr.warning(`You have ${this.pendingApprovals} pending user approvals`);
    } else {
      this.toastr.success('No pending approvals');
    }
  }
}