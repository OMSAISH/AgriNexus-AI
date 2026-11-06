import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  InventoryItem,
  InventoryTransaction,
  LowStockAlert,
} from '../models/agrinexus.models';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private api = inject(ApiService);

  getItems(params?: { farm_id?: string; category?: string; low_stock_only?: boolean }): Observable<InventoryItem[]> {
    return this.api.get<InventoryItem[]>('/inventory/items', { params: params as any });
  }

  getItem(id: string): Observable<InventoryItem> {
    return this.api.get<InventoryItem>(`/inventory/items/${id}`);
  }

  createItem(payload: Partial<InventoryItem>): Observable<InventoryItem> {
    return this.api.post<InventoryItem>('/inventory/items', payload);
  }

  updateItem(id: string, payload: Partial<InventoryItem>): Observable<InventoryItem> {
    return this.api.put<InventoryItem>(`/inventory/items/${id}`, payload);
  }

  deleteItem(id: string): Observable<{ success: boolean; message: string }> {
    return this.api.delete<{ success: boolean; message: string }>(`/inventory/items/${id}`);
  }

  recordTransaction(payload: {
    item_id: string;
    transaction_type: 'INWARD' | 'OUTWARD' | 'ADJUSTMENT';
    quantity: number;
    unit_price?: number;
    transaction_date?: string;
    notes?: string;
  }): Observable<InventoryTransaction> {
    return this.api.post<InventoryTransaction>('/inventory/transactions', payload);
  }

  getTransactions(params?: { item_id?: string }): Observable<InventoryTransaction[]> {
    return this.api.get<InventoryTransaction[]>('/inventory/transactions', { params: params as any });
  }

  getLowStockAlerts(farm_id?: string): Observable<LowStockAlert[]> {
    return this.api.get<LowStockAlert[]>('/inventory/alerts', { params: farm_id ? { farm_id } : undefined });
  }
}
