// auth-service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environment/environment';

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
  private apiUrl = `${environment.baseUrl}/api/auth`;
  private currentUserRole = new BehaviorSubject<string>('');
  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(null);

  constructor(private http: HttpClient) {
    this.loadUserRoleFromToken();
  }


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
    this.updateCurrentUserFromToken();
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserRole.next('');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const decoded = this.decodeToken(token);
    if (!decoded) return false;

    return Date.now() < decoded.exp * 1000;
  }

  // ==================== EXISTING ROLE CHECKING METHODS ====================

  isSuperAdmin(): boolean {
    return this.getCurrentUserRole() === 'super-admin';
  }

  isAdmin(): boolean {
    const role = this.getCurrentUserRole();
    return role === 'admin' || role === 'super-admin';
  }


  isStaff(): boolean {
    const role = this.getCurrentUserRole();
    return role === 'staff' || role === 'admin' || role === 'super-admin';
  }

  canManageUsers(): boolean {
    return this.isAdmin() || this.isSuperAdmin();
  }

  canManageSuperAdmins(): boolean {
    return this.isSuperAdmin();
  }

  canDeleteEntities(): boolean {
    return this.isAdmin() || this.isSuperAdmin();
  }


  canEditEntities(): boolean {
    return this.isAuthenticated();
  }

  /**
   * Check if user can change a specific user's role
   * @param targetUserRole The role of the user being modified
   */
  canChangeUserRole(targetUserRole: string): boolean {
    const currentRole = this.getCurrentUserRole();
    const currentUser = this.getCurrentUser();
    
    // Prevent self-role-change
    if (currentUser && targetUserRole === currentUser.role) {
      return false;
    }
    
    if (currentRole === 'super-admin') {
      return true; // Super-admin can change any role except their own
    }
    
    if (currentRole === 'admin') {
      return targetUserRole === 'staff'; // Admin can only change staff roles
    }
    
    return false;
  }

  /**
   * Check if user can view a specific user's details
   * @param targetUserRole The role of the user being viewed
   */
  canViewUser(targetUserRole: string): boolean {
    const currentRole = this.getCurrentUserRole();
    
    if (currentRole === 'super-admin') {
      return true; // Super-admin can see all users
    }
    
    if (currentRole === 'admin') {
      return true; // Admin can see all except super-admins
    }
    
    return false; // Staff cannot see any user management
  }

  /**
   * Get user's dashboard route based on role
   */
  getDashboardRoute(): string {
    const role = this.getCurrentUserRole();
    switch (role) {
      case 'super-admin': return '/super-admin';
      case 'admin': return '/admin';
      case 'staff': return '/user';
      default: return '/auth/login';
    }
  }

  
  getModuleBasePath(): string {
    return this.getDashboardRoute();
  }

  /**
   * Check if user has access to a specific feature
   * @param feature The feature to check access for
   */
  hasAccessToFeature(feature: string): boolean {
    const role = this.getCurrentUserRole();
    
    const featureAccess: { [key: string]: string[] } = {
      'user_management': ['admin', 'super-admin'],
      'super_admin_management': ['super-admin'],
      'delete_operations': ['admin', 'super-admin'],
      'warehouse_management': ['staff', 'admin', 'super-admin'],
      'floor_management': ['staff', 'admin', 'super-admin'],
      'room_management': ['staff', 'admin', 'super-admin'],
      'goods_management': ['staff', 'admin', 'super-admin'],
      'category_management': ['staff', 'admin', 'super-admin']
    };

    return featureAccess[feature]?.includes(role) || false;
  }

  private loadUserRoleFromToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.updateUserRoleFromToken();
      this.updateCurrentUserFromToken();
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

  getRoleDisplayName(): string {
    const role = this.getCurrentUserRole();
    switch (role) {
      case 'super-admin': return 'Super Admin';
      case 'admin': return 'Admin';
      case 'staff': return 'Staff';
      default: return 'User';
    }
  }

  
  getUserInitials(): string {
    const user = this.getCurrentUser();
    return user?.email?.charAt(0).toUpperCase() || 'U';
  }

  
  isTokenExpiringSoon(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const decoded = this.decodeToken(token);
    if (!decoded) return false;

    const expiresIn = (decoded.exp * 1000) - Date.now();
    return expiresIn < 5 * 60 * 1000; 
  }

 
  getTokenExpirationTime(): Date | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const decoded = this.decodeToken(token);
    if (!decoded) return null;

    return new Date(decoded.exp * 1000);
  }
}