import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../../auth/services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
@Output() toggleSidebar = new EventEmitter<void>();
  
  showUserMenu = false;
  currentUser: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    this.authService.getCurrentUser$().subscribe(user => {
      this.currentUser = user;
    });
    
    
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
}
