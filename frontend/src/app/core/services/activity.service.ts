import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { FarmActivity } from '../models/agrinexus.models';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private api = inject(ApiService);

  getActivities(params?: { farm_id?: string; status?: string; priority?: string }): Observable<FarmActivity[]> {
    return this.api.get<FarmActivity[]>('/activities', { params: params as any });
  }

  createActivity(payload: Partial<FarmActivity>): Observable<FarmActivity> {
    return this.api.post<FarmActivity>('/activities', payload);
  }

  updateActivity(id: string, payload: Partial<FarmActivity>): Observable<FarmActivity> {
    return this.api.put<FarmActivity>(`/activities/${id}`, payload);
  }

  deleteActivity(id: string): Observable<{ success: boolean; message: string }> {
    return this.api.delete<{ success: boolean; message: string }>(`/activities/${id}`);
  }
}
