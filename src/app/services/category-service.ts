import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/services/auth-service';
import { GoodsCategory } from './goods-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.baseUrl}/api/goods-category`;

  constructor(
    private http: HttpClient,
    private authService: AuthService 
  ) {}

  getAllCategories(): Observable<GoodsCategory[]> {
    return this.http.get<GoodsCategory[]>(`${this.apiUrl}/all`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getCategoryById(id: number): Observable<GoodsCategory> {
    return this.http.get<GoodsCategory>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  createCategory(name: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/create`, { name }, {
      headers: this.authService.getAuthHeaders()
    });
  }

  updateCategory(id: number, name: string): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/update/${id}`, { name }, {
      headers: this.authService.getAuthHeaders()
    });
  }

  deleteCategory(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/delete/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
