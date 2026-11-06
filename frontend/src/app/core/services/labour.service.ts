import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  LabourWorker,
  LabourAttendance,
  LabourSummary,
} from '../models/agrinexus.models';

@Injectable({
  providedIn: 'root',
})
export class LabourService {
  private api = inject(ApiService);

  getWorkers(params?: { farm_id?: string; active_only?: boolean }): Observable<LabourWorker[]> {
    return this.api.get<LabourWorker[]>('/labour/workers', { params: params as any });
  }

  getWorker(id: string): Observable<LabourWorker> {
    return this.api.get<LabourWorker>(`/labour/workers/${id}`);
  }

  createWorker(payload: Partial<LabourWorker>): Observable<LabourWorker> {
    return this.api.post<LabourWorker>('/labour/workers', payload);
  }

  updateWorker(id: string, payload: Partial<LabourWorker>): Observable<LabourWorker> {
    return this.api.put<LabourWorker>(`/labour/workers/${id}`, payload);
  }

  deleteWorker(id: string): Observable<{ success: boolean; message: string }> {
    return this.api.delete<{ success: boolean; message: string }>(`/labour/workers/${id}`);
  }

  recordAttendance(payload: {
    labour_id: string;
    farm_id: string;
    attendance_date?: string;
    status: 'PRESENT' | 'HALF_DAY' | 'ABSENT';
    hours_worked?: number;
    wage_paid?: number;
    notes?: string;
  }): Observable<LabourAttendance> {
    return this.api.post<LabourAttendance>('/labour/attendance', payload);
  }

  getAttendance(params?: { farm_id?: string; labour_id?: string; attendance_date?: string }): Observable<LabourAttendance[]> {
    return this.api.get<LabourAttendance[]>('/labour/attendance', { params: params as any });
  }

  getSummary(farm_id?: string): Observable<LabourSummary> {
    return this.api.get<LabourSummary>('/labour/summary', { params: farm_id ? { farm_id } : undefined });
  }
}
