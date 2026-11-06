import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Crop, CropCreatePayload, CropPerformanceSummary } from '../models/agrinexus.models';

@Injectable({
  providedIn: 'root'
})
export class CropService {
  private readonly api = inject(ApiService);

  getCrops(filters?: { field_id?: string; farm_id?: string; status?: string }): Observable<Crop[]> {
    const options = filters ? { params: filters } : undefined;
    return this.api.get<Crop[]>('/crops', options);
  }

  getPerformanceSummary(farm_id?: string): Observable<CropPerformanceSummary> {
    const options = farm_id ? { params: { farm_id } } : undefined;
    return this.api.get<CropPerformanceSummary>('/crops/performance/summary', options);
  }

  transitionStage(cropId: string, newStage: string, notes?: string): Observable<Crop> {
    return this.api.post<Crop>(`/crops/${cropId}/stage`, { new_stage: newStage, notes });
  }

  getCropById(id: string): Observable<Crop> {
    return this.api.get<Crop>(`/crops/${id}`);
  }

  createCrop(crop: CropCreatePayload): Observable<Crop> {
    return this.api.post<Crop>('/crops', crop);
  }

  updateCrop(id: string, crop: Partial<CropCreatePayload>): Observable<Crop> {
    return this.api.put<Crop>(`/crops/${id}`, crop);
  }

  deleteCrop(id: string): Observable<{ success: boolean; message: string }> {
    return this.api.delete<{ success: boolean; message: string }>(`/crops/${id}`);
  }
}
