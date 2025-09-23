import { Component } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Snackbar } from '../../../services/snackbar';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
 loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  constructor(private authService: AuthService, private snackbarService: Snackbar,private router: Router) {}

  onLogin() {
    const data = this.loginForm.value;

    this.authService.login(data).subscribe({
      next: (res) => {
        if (res.token) {
          this.authService.setToken(res.token);
          alert('Login successful!');
          
          // Redirect based on user role
          this.redirectBasedOnRole();
        } else {
          alert(res.message || 'Login failed');
        }
      },
      error: (err) => {
        this.snackbarService.openSnackBar('Error loading users data', 'error');
      }
    });
  }

  private redirectBasedOnRole(): void {
    const role = this.authService.getCurrentUserRole();
    
    switch (role) {
      case 'admin':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'super-admin':
        this.router.navigate(['/super-admin/dashboard']);
        break;
      case 'staff': 
        this.router.navigate(['/user/dashboard']);
        break;
      default:
        this.router.navigate(['/home']);
        break;
    }
  }
}
