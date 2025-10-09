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
  isSidenavOpen = false;

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
}