import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError } from 'rxjs';
import { AuthService } from '../auth/services/auth-service';

export interface Warehouse {
  id: number;
  name: string;
}

export interface WarehouseRequest {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  private apiUrl = 'http://localhost:8080/api/warehouse';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Create new warehouse - expects string response
  createWarehouse(data: WarehouseRequest): Observable<string> {
    console.log('Creating warehouse:', data);
    return this.http.post(`${this.apiUrl}/create`, data, {
      headers: this.authService.getAuthHeaders(),
      responseType: 'text'
    }).pipe(
      tap(response => console.log('Create warehouse response:', response)),
      catchError(error => {
        console.error('Create warehouse error:', error);
        throw error;
      })
    );
  }

  // Get all warehouses - expects Warehouse[] response
  getAllWarehouses(): Observable<Warehouse[]> {
    console.log('Fetching all warehouses');
    return this.http.get<Warehouse[]>(`${this.apiUrl}/get/all`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      tap(warehouses => console.log('Warehouses fetched:', warehouses)),
      catchError(error => {
        console.error('Get all warehouses error:', error);
        throw error;
      })
    );
  }

  // Get warehouse by ID - expects Warehouse response
  getWarehouseById(id: number): Observable<Warehouse> {
    return this.http.get<Warehouse>(`${this.apiUrl}/get/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Update warehouse - expects string response
  updateWarehouse(id: number, data: WarehouseRequest): Observable<string> {
    console.log('Updating warehouse:', id, data);
    return this.http.put(`${this.apiUrl}/update/${id}`, data, {
      headers: this.authService.getAuthHeaders(),
      responseType: 'text'
    }).pipe(
      tap(response => console.log('Update warehouse response:', response)),
      catchError(error => {
        console.error('Update warehouse error:', error);
        throw error;
      })
    );
  }

  // Delete warehouse - expects string response
  deleteWarehouse(id: number): Observable<string> {
    console.log('Deleting warehouse:', id);
    return this.http.delete(`${this.apiUrl}/delete/${id}`, {
      headers: this.authService.getAuthHeaders(),
      responseType: 'text'
    }).pipe(
      tap(response => console.log('Delete warehouse response:', response)),
      catchError(error => {
        console.error('Delete warehouse error:', error);
        throw error;
      })
    );
  }
}