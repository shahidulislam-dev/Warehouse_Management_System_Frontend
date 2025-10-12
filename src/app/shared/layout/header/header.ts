// shared/layout/header/header.component.ts
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth-service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  
  showUserMenu = false;
  currentUser: any = null;
   logoUrl = '../../../../assets/images/cpdslogo.png';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    this.authService.getCurrentUser$().subscribe(user => {
      this.currentUser = user;
    });
  }
toggleDesktopSidebar(): void {
  // Only toggle on desktop
  if (window.innerWidth >= 768) {
    this.toggleSidebar.emit();
  }
}
  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  closeUserMenu(): void {
    this.showUserMenu = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
    this.closeUserMenu();
  }

  getUserInitials(): string {
    return this.currentUser?.email?.charAt(0).toUpperCase() || 'U';
  }

  getUserRoleDisplay(): string {
    return this.currentUser?.role?.replace('-', ' ') || 'User';
  }

  // Get dashboard route based on role
  getDashboardRoute(): string {
    return this.authService.getDashboardRoute();
  }
  
}