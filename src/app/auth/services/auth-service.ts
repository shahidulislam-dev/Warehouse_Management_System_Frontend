// auth-service.ts - Corrected version
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

interface CurrentUser {
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserRole = new BehaviorSubject<string>('');
  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(null);

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

  getCurrentUser(): CurrentUser | null {
    return this.currentUserSubject.value;
  }

  getCurrentUser$(): Observable<CurrentUser | null> {
    return this.currentUserSubject.asObservable();
  }

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

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

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
    this.updateCurrentUserFromToken(); // ADD THIS LINE
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserRole.next('');
    this.currentUserSubject.next(null); // ADD THIS LINE
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const decoded = this.decodeToken(token);
    if (!decoded) return false;

    return Date.now() < decoded.exp * 1000;
  }

  // Helper methods for role checking
  isSuperAdmin(): boolean {
    return this.getCurrentUserRole() === 'super-admin';
  }

  isAdmin(): boolean {
    const role = this.getCurrentUserRole();
    return role === 'admin' || role === 'super-admin';
  }

  private loadUserRoleFromToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.updateUserRoleFromToken();
      this.updateCurrentUserFromToken(); // ADD THIS LINE
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

  // ADD THIS METHOD to update current user subject
  private updateCurrentUserFromToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = this.decodeToken(token);
      if (decoded) {
        const currentUser: CurrentUser = {
          email: decoded.sub,
          role: decoded.role,
        };
        this.currentUserSubject.next(currentUser);
      }
    }
  }
}