import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError } from 'rxjs';
import { AuthService } from '../auth/services/auth-service';
import { environment } from '../../environment/environment';

export interface Floor {
  id: number;
  name: string;
  warehouseName: string;
}

export interface FloorRequest {
  name: string;
  warehouseId: number;
}

export interface FloorWrapper {
  id: number;
  name: string;
  warehouseName: string;
}

@Injectable({
  providedIn: 'root'
})
export class FloorsService {
  private apiUrl = `${environment.baseUrl}/api/floor`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Create new floor - expects string response
  createFloor(data: FloorRequest): Observable<string> {
    console.log('Creating floor:', data);
    return this.http.post(`${this.apiUrl}/create`, data, {
      headers: this.authService.getAuthHeaders(),
      responseType: 'text'
    }).pipe(
      tap(response => console.log('Create floor response:', response)),
      catchError(error => {
        console.error('Create floor error:', error);
        throw error;
      })
    );
  }

  // Get all floors - expects FloorWrapper[] response
  getAllFloors(): Observable<FloorWrapper[]> {
    console.log('Fetching all floors');
    return this.http.get<FloorWrapper[]>(`${this.apiUrl}/get/all`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      tap(floors => console.log('Floors fetched:', floors)),
      catchError(error => {
        console.error('Get all floors error:', error);
        throw error;
      })
    );
  }

  // Get floors by warehouse ID
  getFloorsByWarehouseId(warehouseId: number): Observable<FloorWrapper[]> {
    console.log('Fetching floors for warehouse:', warehouseId);
    return this.http.get<FloorWrapper[]>(`${this.apiUrl}/get/by-warehouse/${warehouseId}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      tap(floors => console.log('Floors by warehouse:', floors)),
      catchError(error => {
        console.error('Get floors by warehouse error:', error);
        throw error;
      })
    );
  }

  // Get floor by ID
  getFloorById(id: number): Observable<Floor> {
    return this.http.get<Floor>(`${this.apiUrl}/get/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Update floor - expects string response
  updateFloor(id: number, data: FloorRequest): Observable<string> {
    console.log('Updating floor:', id, data);
    return this.http.put(`${this.apiUrl}/update/${id}`, data, {
      headers: this.authService.getAuthHeaders(),
      responseType: 'text'
    }).pipe(
      tap(response => console.log('Update floor response:', response)),
      catchError(error => {
        console.error('Update floor error:', error);
        throw error;
      })
    );
  }

  // Delete floor - expects string response
  deleteFloor(id: number): Observable<string> {
    console.log('Deleting floor:', id);
    return this.http.delete(`${this.apiUrl}/delete/${id}`, {
      headers: this.authService.getAuthHeaders(),
      responseType: 'text'
    }).pipe(
      tap(response => console.log('Delete floor response:', response)),
      catchError(error => {
        console.error('Delete floor error:', error);
        throw error;
      })
    );
  }
}