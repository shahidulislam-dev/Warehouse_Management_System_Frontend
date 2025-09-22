// auth-service.ts - Updated version
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string;
  role: string;
  exp: number;
  iat: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserRole = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {
    this.loadUserRoleFromToken();
  }

  // Existing methods
  signup(data: any): Observable<any> { 
    return this.http.post(`${this.apiUrl}/signup`, data);
   }
  login(data: any): Observable<any> { 
    return this.http.post(`${this.apiUrl}/login`, data);
  }
  getAllUsers(): Observable<any> { 
    return this.http.get(`${this.apiUrl}/get`); 
  }
  changePassword(data: any): Observable<any> { 
    return this.http.post(`${this.apiUrl}/changePassword`, data); 
  }
  forgotPassword(data: any): Observable<any> { 
    return this.http.post(`${this.apiUrl}/forgotPassword`, data); 
  }

  // New methods for Super Admin functionality
  updateUserStatus(userId: number, status: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/update`, {
      id: userId.toString(),
      status: status
    }, {
      headers: this.getAuthHeaders()
    });
  }

  createSuperAdmin(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create/super/admin`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // Auth header helper
  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Token management methods (existing)
  decodeToken(token: string): DecodedToken | null {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getCurrentUserRole(): string {
    return this.currentUserRole.value;
  }

  getCurrentUserRole$(): Observable<string> {
    return this.currentUserRole.asObservable();
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
    this.updateUserRoleFromToken();
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserRole.next('');
    this.currentUserRole.next('');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const decoded = this.decodeToken(token);
    if (!decoded) return false;

    return Date.now() < decoded.exp * 1000;
  }

  private loadUserRoleFromToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.updateUserRoleFromToken();
    }
  }

  private updateUserRoleFromToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = this.decodeToken(token);
      if (decoded) {
        this.currentUserRole.next(decoded.role);
      }
    }
  }
}