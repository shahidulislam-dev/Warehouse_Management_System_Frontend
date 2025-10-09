// shared/layout/sidebar/sidebar.component.ts
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../auth/services/auth-service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit {
  @Input() isOpen = false;
  @Output() toggleSidebar = new EventEmitter<void>();
  
  currentModule = '';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setCurrentModule();
    
    // Close sidebar on route change (mobile)
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.closeMobileSidebar();
      });
  }

  private setCurrentModule(): void {
    const role = this.authService.getCurrentUserRole();
    switch (role) {
      case 'super-admin':
        this.currentModule = '/super-admin';
        break;
      case 'admin':
        this.currentModule = '/admin';
        break;
      case 'staff':
        this.currentModule = '/user';
        break;
      default:
        this.currentModule = '/super-admin';
    }
  }

  // Helper method to check if user can see certain menu items
  canSeeUserManagement(): boolean {
    return this.authService.canManageUsers();
  }

  canSeeSuperAdminFeatures(): boolean {
    return this.authService.canManageSuperAdmins();
  }

  // Close sidebar on mobile when menu item is clicked
  closeMobileSidebar(): void {
  if (window.innerWidth < 768) {
    this.toggleSidebar.emit(); // closes sidebar on mobile
  }
}

  // Handle menu item click
  onMenuItemClick(): void {
    this.closeMobileSidebar();
  }
}