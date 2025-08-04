import { Injectable } from '@angular/core';
import { Product } from './Product';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) { }


  getAllProducts(): Observable<Product[]> {

    return this.http.get<Product[]>(`${this.baseUrl}`);
}

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }
  createProduct(formData: FormData): Observable<Product> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token ? token : ''}`
    });
  
    return this.http.post<Product>(`${this.baseUrl}`, formData, { headers }).pipe(
      catchError(error => {
        console.error('Error creating product:', error);
        return throwError(() => new Error('Failed to create product. Please try again later.'));
      })
    );
  }
  updateProduct(id: number, productDetails: Product): Observable<Product> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token ? token : ''}`,
      'Content-Type': 'application/json'  // Specify content type as JSON
    });

    return this.http.put<Product>(`${this.baseUrl}/${id}`, productDetails, { headers }).pipe(
      catchError(error => {
        console.error('Error updating product:', error);
        return throwError(() => new Error('Failed to update product. Please try again later.'));
      })
    );
  }
  deleteProduct(productId: number): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token ? token : ''}`
    });
  
    return this.http.delete(`${this.baseUrl}/${productId}`, { headers, responseType: 'text' }).pipe(
      catchError(error => {
        console.error('Error deleting product:', error);
        return throwError(() => new Error('Failed to delete product. Please try again later.'));
      })
    );
  }
 
  
  addAttribute(id: number, attribute: { key: string, value: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/attributes`, attribute);
  }
  getProductsSocieteEmpl(societeId: number): Observable<Product[]> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token ? token : ''}`
    });
  
    return this.http.get<Product[]>(`${this.baseUrl}/products-societe/${societeId}`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching products for society:', error);
        return throwError(() => new Error('Failed to fetch products for the society. Please try again later.'));
      })
    );
  }
  
}
