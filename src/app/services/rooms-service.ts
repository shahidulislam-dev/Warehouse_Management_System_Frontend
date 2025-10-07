import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError } from 'rxjs';
import { AuthService } from '../auth/services/auth-service';
import { environment } from '../../environment/environment';

export interface Room {
  id: number;
  name: string;
  floorName: string;
  warehouseName: string;
}

export interface RoomRequest {
  name: string;
  floorId: number;
}

export interface RoomsWrapper {
  id: number;
  name: string;
  floorName: string;
  warehouseName: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  private apiUrl = `${environment.baseUrl}/api/room`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Create new room - expects string response
  createRoom(data: RoomRequest): Observable<string> {
    console.log('Creating room:', data);
    return this.http.post(`${this.apiUrl}/create`, data, {
      headers: this.authService.getAuthHeaders(),
      responseType: 'text'
    }).pipe(
      tap(response => console.log('Create room response:', response)),
      catchError(error => {
        console.error('Create room error:', error);
        throw error;
      })
    );
  }

  // Get all rooms - expects RoomsWrapper[] response
  getAllRooms(): Observable<RoomsWrapper[]> {
    console.log('Fetching all rooms');
    return this.http.get<RoomsWrapper[]>(`${this.apiUrl}/get/all`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      tap(rooms => console.log('Rooms fetched:', rooms)),
      catchError(error => {
        console.error('Get all rooms error:', error);
        throw error;
      })
    );
  }

  // Get rooms by warehouse ID
  getRoomsByWarehouseId(warehouseId: number): Observable<RoomsWrapper[]> {
    console.log('Fetching rooms for warehouse:', warehouseId);
    return this.http.get<RoomsWrapper[]>(`${this.apiUrl}/get/by-warehouse/${warehouseId}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      tap(rooms => console.log('Rooms by warehouse:', rooms)),
      catchError(error => {
        console.error('Get rooms by warehouse error:', error);
        throw error;
      })
    );
  }

  // Get rooms by floor and warehouse
  getRoomsByFloorAndWarehouse(floorId: number, warehouseId: number): Observable<RoomsWrapper[]> {
    console.log('Fetching rooms for floor:', floorId, 'and warehouse:', warehouseId);
    return this.http.get<RoomsWrapper[]>(`${this.apiUrl}/get/by/floor/${floorId}/warehouse/${warehouseId}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      tap(rooms => console.log('Rooms by floor and warehouse:', rooms)),
      catchError(error => {
        console.error('Get rooms by floor and warehouse error:', error);
        throw error;
      })
    );
  }

  // Get room by ID
  getRoomById(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/get/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Update room - expects string response
  updateRoom(id: number, data: RoomRequest): Observable<string> {
    console.log('Updating room:', id, data);
    return this.http.put(`${this.apiUrl}/update/${id}`, data, {
      headers: this.authService.getAuthHeaders(),
      responseType: 'text'
    }).pipe(
      tap(response => console.log('Update room response:', response)),
      catchError(error => {
        console.error('Update room error:', error);
        throw error;
      })
    );
  }

  // Delete room - expects string response
  deleteRoom(id: number): Observable<string> {
    console.log('Deleting room:', id);
    return this.http.delete(`${this.apiUrl}/delete/${id}`, {
      headers: this.authService.getAuthHeaders(),
      responseType: 'text'
    }).pipe(
      tap(response => console.log('Delete room response:', response)),
      catchError(error => {
        console.error('Delete room error:', error);
        throw error;
      })
    );
  }
}