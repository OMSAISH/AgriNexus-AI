import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  EquipmentItem,
  EquipmentMaintenance,
  EquipmentSummary,
} from '../models/agrinexus.models';

@Injectable({
  providedIn: 'root',
})
export class EquipmentService {
  private api = inject(ApiService);

  getEquipment(params?: { farm_id?: string; status_filter?: string }): Observable<EquipmentItem[]> {
    return this.api.get<EquipmentItem[]>('/equipment/items', { params: params as any });
  }

  getEquipmentDetail(id: string): Observable<EquipmentItem> {
    return this.api.get<EquipmentItem>(`/equipment/items/${id}`);
  }

  createEquipment(payload: Partial<EquipmentItem>): Observable<EquipmentItem> {
    return this.api.post<EquipmentItem>('/equipment/items', payload);
  }

  updateEquipment(id: string, payload: Partial<EquipmentItem>): Observable<EquipmentItem> {
    return this.api.put<EquipmentItem>(`/equipment/items/${id}`, payload);
  }

  deleteEquipment(id: string): Observable<{ success: boolean; message: string }> {
    return this.api.delete<{ success: boolean; message: string }>(`/equipment/items/${id}`);
  }

  logMaintenance(payload: {
    equipment_id: string;
    maintenance_date?: string;
    service_type: string;
    cost: number;
    description: string;
    technician_name?: string;
    next_service_due?: string;
  }): Observable<EquipmentMaintenance> {
    return this.api.post<EquipmentMaintenance>('/equipment/maintenance', payload);
  }

  getMaintenanceRecords(equipment_id?: string): Observable<EquipmentMaintenance[]> {
    return this.api.get<EquipmentMaintenance[]>('/equipment/maintenance', {
      params: equipment_id ? { equipment_id } : undefined,
    });
  }

  getSummary(farm_id?: string): Observable<EquipmentSummary> {
    return this.api.get<EquipmentSummary>('/equipment/summary', { params: farm_id ? { farm_id } : undefined });
  }
}
