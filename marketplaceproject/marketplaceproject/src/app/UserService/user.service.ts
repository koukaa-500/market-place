import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}


  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
  
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
  getEmployeesForSociete(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/employees`, {
      headers: this.getAuthHeaders()
    });
  }
  createUser(newUser: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/create`, newUser, {
      headers: this.getAuthHeaders()
    });
  }
  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`, { headers: this.getAuthHeaders() });
  }
  // Fetch user by ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // Fetch all users
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user, { headers: this.getAuthHeaders() });
  }

  

  // Delete user
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }
  
  
  // Update user profile image
  updateUserImage(id: number, imageFile: File): Observable<User> {
    const formData = new FormData();
    formData.append('image', imageFile);

    return this.http.put<User>(`${this.apiUrl}/${id}/update-image`, formData, { 
      headers: this.getAuthHeaders(), 
      reportProgress: true,
      responseType: 'json'
    });
  }
}
