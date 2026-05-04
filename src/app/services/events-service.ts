// services/events-service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/services/auth-service';
import { environment } from '../../environment/environment';

export interface EventsResponse {
  id: number;
  eventName: string;
  eventDate: string;
  active: boolean;
  createdAt: string;
}

export interface EventsRequest {
  eventName: string;
  eventDate: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private apiUrl = `${environment.baseUrl}/api/events`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  createEvent(data: EventsRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/create`, data, {
      headers: this.authService.getAuthHeaders(),
      responseType: 'text'
    });
  }

  getAllEvents(): Observable<EventsResponse[]> {
    return this.http.get<EventsResponse[]>(`${this.apiUrl}/all`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getEventById(id: number): Observable<EventsResponse> {
    return this.http.get<EventsResponse>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getEventsByName(eventName: string): Observable<EventsResponse[]> {
    return this.http.get<EventsResponse[]>(`${this.apiUrl}/name/${eventName}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getActiveEvents(): Observable<EventsResponse[]> {
    return this.http.get<EventsResponse[]>(`${this.apiUrl}/active`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  updateEvent(id: number, data: EventsRequest): Observable<string> {
    return this.http.put(`${this.apiUrl}/update/${id}`, data, {
      headers: this.authService.getAuthHeaders(),
      responseType: 'text'
    });
  }

  deleteEvent(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, {
      headers: this.authService.getAuthHeaders(),
      responseType: 'text'
    });
  }
}