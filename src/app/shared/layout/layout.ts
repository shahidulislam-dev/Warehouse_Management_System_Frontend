// shared/layout/layout.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth-service';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout implements OnInit {
  isSidenavOpen = true; // Default open on desktop

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Redirect if not authenticated
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
    }
  }

  toggleSidenav(): void {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  // Close sidebar on mobile (called from sidebar component)
  closeMobileSidebar(): void {
    if (window.innerWidth < 768) {
      this.isSidenavOpen = false;
    }
  }
}