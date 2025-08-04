import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:8080/api/category';

  constructor(private http: HttpClient) { }

  // Get all categories
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching categories:', error);
        return throwError(() => new Error('Failed to fetch categories.'));
      })
    );
  }

  // Get a category by ID
  getCategoryById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error fetching category with ID ${id}:`, error);
        return throwError(() => new Error(`Failed to fetch category with ID ${id}.`));
      })
    );
  }

  // Create a new category with Bearer token
  createCategory(category: any): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token ? token : ''}`,
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(this.apiUrl, category, { headers }).pipe(
      catchError((error) => {
        console.error('Error creating category:', error);
        return throwError(() => new Error('Failed to create category.'));
      })
    );
  }

  // Update an existing category with Bearer token
  updateCategory(category: any): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token ? token : ''}`,
      'Content-Type': 'application/json'
    });
  
    return this.http.put<any>(`${this.apiUrl}/${category.id}`, category, { headers }).pipe(
      catchError((error) => {
        console.error(`Error updating category with ID ${category.id}:`, error);
        return throwError(() => new Error(`Failed to update category with ID ${category.id}.`));
      })
    );
  }
  

  // Delete a category with Bearer token
  deleteCategory(id: number): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token ? token : ''}`,
    });
  
    return this.http.delete(`${this.apiUrl}/${id}`, { headers, observe: 'response' }).pipe(
      catchError((error) => {
        console.error(`Error deleting category with ID ${id}:`, error);
        return throwError(() => new Error(`Failed to delete category with ID ${id}.`));
      })
    );
  }
  
}
