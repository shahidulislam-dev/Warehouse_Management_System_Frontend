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
  @Output() menuItemClick = new EventEmitter<void>();
  
  currentModule = '';
  isMobile = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.setCurrentModule();
    
    // Listen for screen size changes
    window.addEventListener('resize', () => this.checkScreenSize());
    
    // Auto-navigate to dashboard on mobile
    if (this.isMobile) {
      this.router.navigate([this.currentModule + '/dashboard']);
    }
    
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.handleRouteChange();
      });
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
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

  private handleRouteChange(): void {
    if (this.isMobile) {
      this.menuItemClick.emit();
    }
  }

  canSeeUserManagement(): boolean {
    return this.authService.canManageUsers();
  }

  canSeeSuperAdminFeatures(): boolean {
    return this.authService.canManageSuperAdmins();
  }

  // Handle menu item click
  onMenuItemClick(): void {
    if (this.isMobile) {
      this.menuItemClick.emit();
    }
  }

  // Toggle sidebar
  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
}