import { Component } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
fullName = '';
  contactNumber = '';
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSignup() {
    const data = {
      fullName: this.fullName,
      contactNumber: this.contactNumber,
      email: this.email,
      password: this.password,
    };

    this.authService.signup(data).subscribe({
      next: (res) => {
        alert('Signup Successful! Please wait for admin approval.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert(err.error?.message || 'Signup failed');
      }
    });
  }
}
