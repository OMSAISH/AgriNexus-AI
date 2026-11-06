import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { FieldPlot, FieldCreatePayload } from '../models/agrinexus.models';

@Injectable({
  providedIn: 'root'
})
export class FieldService {
  private readonly api = inject(ApiService);

  getFields(farmId?: string): Observable<FieldPlot[]> {
    const options = farmId ? { params: { farm_id: farmId } } : undefined;
    return this.api.get<FieldPlot[]>('/fields', options);
  }

  getFieldById(id: string): Observable<FieldPlot> {
    return this.api.get<FieldPlot>(`/fields/${id}`);
  }

  createField(field: FieldCreatePayload): Observable<FieldPlot> {
    return this.api.post<FieldPlot>('/fields', field);
  }

  updateField(id: string, field: Partial<FieldCreatePayload>): Observable<FieldPlot> {
    return this.api.put<FieldPlot>(`/fields/${id}`, field);
  }

  deleteField(id: string): Observable<{ success: boolean; message: string }> {
    return this.api.delete<{ success: boolean; message: string }>(`/fields/${id}`);
  }
}
