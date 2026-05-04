// services/departments-service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/services/auth-service';
import { environment } from '../../environment/environment';

export interface DepartmentsResponse {
  id: number;
  departmentName: string;
}

export interface DepartmentsRequest {
  departmentName: string;
}

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {
  private apiUrl = `${environment.baseUrl}/api/departments`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  createDepartment(data: DepartmentsRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/create`, data, {
      headers: this.authService.getAuthHeaders(),
      responseType: 'text'
    });
  }

  getAllDepartments(): Observable<DepartmentsResponse[]> {
    return this.http.get<DepartmentsResponse[]>(`${this.apiUrl}/all`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getDepartmentById(id: number): Observable<DepartmentsResponse> {
    return this.http.get<DepartmentsResponse>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getDepartmentsByName(departmentName: string): Observable<DepartmentsResponse[]> {
    return this.http.get<DepartmentsResponse[]>(`${this.apiUrl}/name/${departmentName}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  updateDepartment(id: number, data: DepartmentsRequest): Observable<string> {
    return this.http.put(`${this.apiUrl}/update/${id}`, data, {
      headers: this.authService.getAuthHeaders(),
      responseType: 'text'
    });
  }

  deleteDepartment(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, {
      headers: this.authService.getAuthHeaders(),
      responseType: 'text'
    });
  }
}