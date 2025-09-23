import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  // Create new warehouse
  createWarehouse(data: WarehouseRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, data, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Get all warehouses - FIXED: Added auth headers
  getAllWarehouses(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(`${this.apiUrl}/get/all`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Get warehouse by ID - FIXED: Added auth headers
  getWarehouseById(id: number): Observable<Warehouse> {
    return this.http.get<Warehouse>(`${this.apiUrl}/get/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Update warehouse
  updateWarehouse(id: number, data: WarehouseRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, data, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Delete warehouse
  deleteWarehouse(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}