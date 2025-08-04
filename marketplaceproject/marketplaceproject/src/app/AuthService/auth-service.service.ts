import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private apiUrl = 'http://localhost:8080/v1/auth';
  private userRole: string = '';

  constructor(private http: HttpClient) {}

  authenticate(loginRequest: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/authenticate`, loginRequest).pipe(
      tap((response) => {
        if (response && response.access_token) {
          localStorage.setItem('accessToken', response.access_token);
          if (response.role) {
            this.setRole(response.role);
          }
        }
      })
    );
  }

  register(registerRequest: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, registerRequest);
  }

  registerSociete(societeRequest: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register-societe`, societeRequest);
  }

  setRole(role: string): void {
    this.userRole = role;
    localStorage.setItem('userRole', role); // Persist role
  }

  getRole(): string {
    if (!this.userRole) {
      this.userRole = localStorage.getItem('userRole') || '';
    }
    return this.userRole;
  }

  hasPermission(requiredRoles: string | string[]): boolean {
    const currentRole = this.getRole();
    console.log('Current Role:', currentRole, 'Required Roles:', requiredRoles);

    if (Array.isArray(requiredRoles)) {
      return requiredRoles.includes(currentRole);
    }
    return currentRole === requiredRoles;
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  oauth2Login(provider: string): void {
    const redirectUri = `http://localhost:8080/oauth2/authorize/${provider}?redirect_uri=http://localhost:4200/oauth2/redirect`;
    window.location.href = redirectUri;
  }

  handleOAuth2Redirect(token: string): void {
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
    const role = decodedToken.role; // Extract role from payload if present

    localStorage.setItem('accessToken', token);
    if (role) {
      this.setRole(role);
    }
  }

  confirm(token: string): Observable<any> {
    const params = new HttpParams().set('code', token);
    return this.http.get(`${this.apiUrl}/verify`, { params });
  }
}
