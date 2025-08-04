import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) { }

  getOrders(searchText: string = '', status: string = '', date: string = ''): Observable<any[]> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token ? token : ''}`,
      'Content-Type': 'application/json',
    });

    let queryParams = `?searchText=${searchText}&status=${status}&date=${date}`;

    return this.http.get<any[]>(`${this.apiUrl}${queryParams}`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching orders:', error);
        return throwError(() => new Error('Failed to fetch orders.'));
      })
    );
  }

  createOrder(order: any): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token ? token : ''}`,
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(this.apiUrl, order, { headers }).pipe(
      catchError(error => {
        console.error('Error placing order:', error);
        return throwError(() => new Error('Failed to place order. Please try again later.'));
      })
    );
  }

  deleteOrder(orderId: number): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token ? token : ''}`,
      'Content-Type': 'application/json',
    });

    return this.http.delete(`${this.apiUrl}/${orderId}`, { headers }).pipe(
      catchError(error => {
        console.error('Error deleting order:', error);
        return throwError(() => new Error('Failed to delete order.'));
      })
    );
  }
  updateOrderStatus(orderId: number): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token ? token : ''}`,
      'Content-Type': 'application/json',
    });

    return this.http.patch<any>(`${this.apiUrl}/${orderId}/status`, null, { headers }).pipe(
      catchError(error => {
        console.error('Error updating order status:', error);
        return throwError(() => new Error('Failed to update order status.'));
      })
    );
  }
  getOrdersBySociete(): Observable<any[]> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token ? token : ''}`,
      'Content-Type': 'application/json',
    });
  
    return this.http.get<any[]>(`${this.apiUrl}/societe-orders`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching orders by societe:', error);
        return throwError(() => new Error('Failed to fetch orders by societe.'));
      })
    );
  }
  getOrdersForUser(): Observable<any[]> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token ? token : ''}`,
      'Content-Type': 'application/json',
    });

    return this.http.get<any[]>(`${this.apiUrl}/my-orders`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching user orders:', error);
        return throwError(() => new Error('Failed to fetch user orders.'));
      })
    );
}

}
