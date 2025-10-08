import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/services/auth-service';
import { Observable } from 'rxjs';

export interface GoodsCategoryRequest {
  name: string;
  unit: string; // Added unit field
}

export interface GoodsCategoryResponse {
  id: number;
  name: string;
  unit: string; // Added unit field
}

export interface GoodsCategoryWrapper {
  id: number;
  name: string;
  unit: string; 
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.baseUrl}/api/goods-category`;

  constructor(
    private http: HttpClient,
    private authService: AuthService 
  ) {}

  getAllCategories(): Observable<GoodsCategoryWrapper[]> {
    return this.http.get<GoodsCategoryWrapper[]>(`${this.apiUrl}/all`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getCategoryById(id: number): Observable<GoodsCategoryResponse> {
    return this.http.get<GoodsCategoryResponse>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  createCategory(request: GoodsCategoryRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, request, {
      headers: this.authService.getAuthHeaders(),
      responseType: 'text' // FIX: Expect text response
    });
  }

  updateCategory(id: number, request: GoodsCategoryRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, request, {
      headers: this.authService.getAuthHeaders(),
      responseType: 'text' // FIX: Expect text response
    });
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, {
      headers: this.authService.getAuthHeaders(),
      responseType: 'text' // FIX: Expect text response
    });
  }
}