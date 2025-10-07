// services/goods-service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/services/auth-service';
import { environment } from '../../environment/environment';

export interface GoodsWrapper {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  categoryName: string;
  roomName: string;
  floorName: string;
  warehouseName: string;
  createdBy: string;
  createDate: string;
  updateDate: string;
}

export interface GoodsResponse {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  categoryName: string;
  roomName: string;
  floorName: string;
  warehouseName: string;
  createdBy: string;
}

export interface GoodsRequest {
  name: string;
  quantity: number;
  unit: string;
  categoryId: number;
  roomId: number;
  floorId: number;
  warehouseId: number;
}

export interface GoodsCategory {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class GoodsService {
  private apiUrl = `${environment.baseUrl}/api/goods`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Create new goods - expects string response
  createGoods(data: GoodsRequest): Observable<string> {
    console.log('Creating goods:', data);
    return this.http.post(`${this.apiUrl}/create`, data, {
      headers: this.authService.getAuthHeaders(),
      responseType: 'text'
    });
  }

  // Get all goods - expects GoodsWrapper[] response
  getAllGoods(): Observable<GoodsWrapper[]> {
    console.log('Fetching all goods');
    return this.http.get<GoodsWrapper[]>(`${this.apiUrl}/get/all`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Get goods by ID
  getGoodsById(id: number): Observable<GoodsResponse> {
    return this.http.get<GoodsResponse>(`${this.apiUrl}/get/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Get goods by warehouse ID
  getGoodsByWarehouse(warehouseId: number): Observable<GoodsWrapper[]> {
    console.log('Fetching goods for warehouse:', warehouseId);
    return this.http.get<GoodsWrapper[]>(`${this.apiUrl}/get/warehouse/${warehouseId}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Get goods by floor ID
  getGoodsByFloor(floorId: number): Observable<GoodsWrapper[]> {
    console.log('Fetching goods for floor:', floorId);
    return this.http.get<GoodsWrapper[]>(`${this.apiUrl}/get/floor/${floorId}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Get goods by room ID
  getGoodsByRoom(roomId: number): Observable<GoodsWrapper[]> {
    console.log('Fetching goods for room:', roomId);
    return this.http.get<GoodsWrapper[]>(`${this.apiUrl}/get/room/${roomId}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Update goods - expects string response
  updateGoods(id: number, data: GoodsRequest): Observable<string> {
    console.log('Updating goods:', id, data);
    return this.http.put(`${this.apiUrl}/update/${id}`, data, {
      headers: this.authService.getAuthHeaders(),
      responseType: 'text'
    });
  }

  // Delete goods - expects string response
  deleteGoods(id: number): Observable<string> {
    console.log('Deleting goods:', id);
    return this.http.delete(`${this.apiUrl}/delete/${id}`, {
      headers: this.authService.getAuthHeaders(),
      responseType: 'text'
    });
  }
}