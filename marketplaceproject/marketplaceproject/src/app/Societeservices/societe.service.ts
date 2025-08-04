import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../UserService/User'; // Assuming this is the correct path for User interface

@Injectable({
  providedIn: 'root'
})
export class SocieteService {

  private apiUrl = 'http://localhost:8080/api/societe';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token ? token : ''}`,
      'Content-Type': 'application/json'
    });
  }
  createSociete(societeRequest: any): Observable<User> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}/create`;

    return this.http.post<User>(url, societeRequest, { headers }).pipe(
      catchError(error => {
        console.error('Error creating Societe:', error);
        return throwError(() => new Error('Failed to create Societe.'));
      })
    );
  }
  updateUserActiveStatus(id: number, activeStatus: boolean): Observable<User> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}/${id}/active`;

    return this.http.patch<User>(url, activeStatus, { headers }).pipe(
      catchError(error => {
        console.error('Error updating active status:', error);
        return throwError(() => new Error('Failed to update active status.'));
      })
    );
  }
  // Get all SOCIETE users
  getAllSocieteUsers(): Observable<User[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<User[]>(`${this.apiUrl}/allusers`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching SOCIETE users:', error);
        return throwError(() => new Error('Failed to fetch SOCIETE users.'));
      })
    );
  }

  // Get a SOCIETE user by ID
  getSocieteUserById(id: number): Observable<User> {
    const headers = this.getAuthHeaders();
    return this.http.get<User>(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching SOCIETE user by ID:', error);
        return throwError(() => new Error('Failed to fetch SOCIETE user by ID.'));
      })
    );
  }

  // Update a SOCIETE user
  updateSocieteUser(id: number, societe: User): Observable<User> {
    const headers = this.getAuthHeaders();
    return this.http.put<User>(`${this.apiUrl}/${id}`, societe, { headers }).pipe(
      catchError(error => {
        console.error('Error updating SOCIETE:', error);
        return throwError(() => new Error('Failed to update SOCIETE.'));
      })
    );
  }
  
  

  // Delete a SOCIETE user
  deleteSocieteUser(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(error => {
        console.error('Error deleting SOCIETE user:', error);
        return throwError(() => new Error('Failed to delete SOCIETE user.'));
      })
    );
  }

  // Get employees of a specific SOCIETE (assuming employees are part of a user structure)
  getSocieteEmployees(societeId: number): Observable<User[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<User[]>(`${this.apiUrl}/${societeId}/employees`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching employees of SOCIETE:', error);
        return throwError(() => new Error('Failed to fetch employees of SOCIETE.'));
      })
    );
  }

  // Example for updating order status (if needed)
  updateOrderStatus(orderId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.patch<any>(`${this.apiUrl}/${orderId}/status`, null, { headers }).pipe(
      catchError(error => {
        console.error('Error updating order status:', error);
        return throwError(() => new Error('Failed to update order status.'));
      })
    );
  }
}
