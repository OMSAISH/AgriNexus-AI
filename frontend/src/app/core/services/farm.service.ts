import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Farm, FarmCreatePayload } from '../models/agrinexus.models';

@Injectable({
  providedIn: 'root'
})
export class FarmService {
  private readonly api = inject(ApiService);

  getFarms(): Observable<Farm[]> {
    return this.api.get<Farm[]>('/farms');
  }

  getFarmById(id: string): Observable<Farm> {
    return this.api.get<Farm>(`/farms/${id}`);
  }

  createFarm(farm: FarmCreatePayload): Observable<Farm> {
    return this.api.post<Farm>('/farms', farm);
  }

  updateFarm(id: string, farm: Partial<FarmCreatePayload>): Observable<Farm> {
    return this.api.put<Farm>(`/farms/${id}`, farm);
  }

  deleteFarm(id: string): Observable<{ success: boolean; message: string }> {
    return this.api.delete<{ success: boolean; message: string }>(`/farms/${id}`);
  }
}
