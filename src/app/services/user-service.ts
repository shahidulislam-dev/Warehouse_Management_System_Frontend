import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/services/auth-service';
import { environment } from '../../environment/environment';
export interface User {
  id: number;
  fullName: string;
  email: string;
  contactNumber: string;
  role: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.baseUrl}/api/auth`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Get all users
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/get`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Update user status
  updateUserStatus(userId: number, status: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/update`, {
      id: userId.toString(),
      status: status
    }, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
