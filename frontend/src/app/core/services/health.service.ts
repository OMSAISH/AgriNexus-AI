import { Injectable, inject, signal } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { HealthCheckResponse, DatabaseHealthResponse } from '../models/health.model';

export interface SystemHealthState {
  backend: HealthCheckResponse | null;
  database: DatabaseHealthResponse | null;
  lastChecked: Date | null;
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class HealthService {
  private readonly api = inject(ApiService);

  // Reactive state signals for UI consumption
  public readonly healthState = signal<SystemHealthState>({
    backend: null,
    database: null,
    lastChecked: null,
    isLoading: false,
    error: null,
  });

  getBackendHealth(): Observable<HealthCheckResponse> {
    return this.api.get<HealthCheckResponse>('/health');
  }

  getDatabaseHealth(): Observable<DatabaseHealthResponse> {
    return this.api.get<DatabaseHealthResponse>('/health/database');
  }

  checkFullSystemHealth(): Observable<[HealthCheckResponse, DatabaseHealthResponse]> {
    this.healthState.update(s => ({ ...s, isLoading: true, error: null }));

    return forkJoin([
      this.getBackendHealth(),
      this.getDatabaseHealth()
    ]).pipe(
      tap({
        next: ([backend, database]) => {
          this.healthState.set({
            backend,
            database,
            lastChecked: new Date(),
            isLoading: false,
            error: null,
          });
        },
        error: (err) => {
          this.healthState.update(s => ({
            ...s,
            isLoading: false,
            error: err.message || 'Failed to verify backend connectivity.',
            lastChecked: new Date(),
          }));
        }
      })
    );
  }
}
