import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ApiRequestOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> };
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  public readonly baseUrl = environment.apiUrl;

  get<T>(endpoint: string, options?: ApiRequestOptions): Observable<T> {
    const url = this.resolveUrl(endpoint);
    return this.http.get<T>(url, options).pipe(
      catchError(this.handleError)
    );
  }

  post<T>(endpoint: string, body: unknown, options?: ApiRequestOptions): Observable<T> {
    const url = this.resolveUrl(endpoint);
    return this.http.post<T>(url, body, options).pipe(
      catchError(this.handleError)
    );
  }

  put<T>(endpoint: string, body: unknown, options?: ApiRequestOptions): Observable<T> {
    const url = this.resolveUrl(endpoint);
    return this.http.put<T>(url, body, options).pipe(
      catchError(this.handleError)
    );
  }

  patch<T>(endpoint: string, body: unknown, options?: ApiRequestOptions): Observable<T> {
    const url = this.resolveUrl(endpoint);
    return this.http.patch<T>(url, body, options).pipe(
      catchError(this.handleError)
    );
  }

  delete<T>(endpoint: string, options?: ApiRequestOptions): Observable<T> {
    const url = this.resolveUrl(endpoint);
    return this.http.delete<T>(url, options).pipe(
      catchError(this.handleError)
    );
  }

  private resolveUrl(endpoint: string): string {
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.baseUrl}${cleanEndpoint}`;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred while communicating with the server.';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side / network error
      errorMessage = `Network Error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      if (error.error && error.error.error && error.error.error.detail) {
        errorMessage = error.error.error.detail;
      } else if (error.error && error.error.detail) {
        errorMessage = typeof error.error.detail === 'string' 
          ? error.error.detail 
          : JSON.stringify(error.error.detail);
      } else if (error.message) {
        errorMessage = error.message;
      }
    }

    console.error(`[ApiService Error ${error.status}]:`, errorMessage, error);
    return throwError(() => ({
      status: error.status,
      message: errorMessage,
      raw: error
    }));
  }
}
