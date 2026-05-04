// services/transactions-service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/services/auth-service';
import { environment } from '../../environment/environment';

export interface TransactionResponse {
  id: number;
  transactionCategory: string;
  status: string;
  issuedById: number;
  issuedByName: string;
  receivedById: number;
  receivedByName: string;
  approvedBy: string;
  goodsId: number;
  goodsName: string;
  quantityIssued: number;
  quantityReturned: number;
  issueDate: string;
  returnDate: string;
  receiverName: string;
  receiverContact: string;
  receiverDutyPlace: string;
  eventId: number;
  eventName: string;
  departmentId: number;
  departmentName: string;
  eventReceiverName: string;
  eventReceiverContact: string;
  createdAt: string;
}

export interface TransactionRequest {
  transactionCategory: string;
  approvedBy: string;
  goodsId: number;
  quantity: number;
  receiverName: string;
  receiverContact: string;
  receiverDutyPlace: string;
  eventId: number;
  departmentId: number;
  eventReceiverName: string;
  eventReceiverContact: string;
}

export interface ReturnRequest {
  transactionId: number;
  quantityReturned: number;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private apiUrl = `${environment.baseUrl}/api/transactions`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  createTransaction(data: TransactionRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/create`, data, {
      headers: this.authService.getAuthHeaders(),
      responseType: 'text'
    });
  }

  returnTransaction(data: ReturnRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/return`, data, {
      headers: this.authService.getAuthHeaders(),
      responseType: 'text'
    });
  }

  updateTransaction(id: number, data: TransactionRequest): Observable<string> {
    return this.http.put(`${this.apiUrl}/update/${id}`, data, {
      headers: this.authService.getAuthHeaders(),
      responseType: 'text'
    });
  }

  deleteTransaction(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, {
      headers: this.authService.getAuthHeaders(),
      responseType: 'text'
    });
  }

  getTransactionById(id: number): Observable<TransactionResponse> {
    return this.http.get<TransactionResponse>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getAllTransactions(): Observable<TransactionResponse[]> {
    return this.http.get<TransactionResponse[]>(`${this.apiUrl}/all`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getByCategory(category: string): Observable<TransactionResponse[]> {
    return this.http.get<TransactionResponse[]>(`${this.apiUrl}/category/${category}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getByEventId(eventId: number): Observable<TransactionResponse[]> {
    return this.http.get<TransactionResponse[]>(`${this.apiUrl}/event/${eventId}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getByDepartmentId(departmentId: number): Observable<TransactionResponse[]> {
    return this.http.get<TransactionResponse[]>(`${this.apiUrl}/department/${departmentId}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getByReceiverName(name: string): Observable<TransactionResponse[]> {
    return this.http.get<TransactionResponse[]>(`${this.apiUrl}/receiver-name/${name}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getByIssueDateRange(start: string, end: string): Observable<TransactionResponse[]> {
    let params = new HttpParams()
      .set('start', start)
      .set('end', end);
    
    return this.http.get<TransactionResponse[]>(`${this.apiUrl}/issue-date`, {
      headers: this.authService.getAuthHeaders(),
      params: params
    });
  }

  getByReturnDateRange(start: string, end: string): Observable<TransactionResponse[]> {
    let params = new HttpParams()
      .set('start', start)
      .set('end', end);
    
    return this.http.get<TransactionResponse[]>(`${this.apiUrl}/return-date`, {
      headers: this.authService.getAuthHeaders(),
      params: params
    });
  }
}