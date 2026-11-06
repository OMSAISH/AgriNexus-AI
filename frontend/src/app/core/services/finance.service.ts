import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  FinancialTransaction,
  FinancialSummary,
} from '../models/agrinexus.models';

export interface TransactionCreatePayload {
  farm_id: string;
  crop_id?: string;
  transaction_type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  transaction_date?: string;
  payment_method?: string;
  invoice_number?: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  private readonly api = inject(ApiService);

  getTransactions(filters?: {
    farm_id?: string;
    crop_id?: string;
    transaction_type?: string;
    start_date?: string;
    end_date?: string;
  }): Observable<FinancialTransaction[]> {
    const options = filters ? { params: filters } : undefined;
    return this.api.get<FinancialTransaction[]>('/finance/transactions', options);
  }

  getTransactionById(id: string): Observable<FinancialTransaction> {
    return this.api.get<FinancialTransaction>(`/finance/transactions/${id}`);
  }

  createTransaction(payload: TransactionCreatePayload): Observable<FinancialTransaction> {
    return this.api.post<FinancialTransaction>('/finance/transactions', payload);
  }

  updateTransaction(id: string, payload: Partial<TransactionCreatePayload>): Observable<FinancialTransaction> {
    return this.api.put<FinancialTransaction>(`/finance/transactions/${id}`, payload);
  }

  deleteTransaction(id: string): Observable<{ success: boolean; message: string }> {
    return this.api.delete<{ success: boolean; message: string }>(`/finance/transactions/${id}`);
  }

  getFinancialSummary(farmId?: string): Observable<FinancialSummary> {
    const options = farmId ? { params: { farm_id: farmId } } : undefined;
    return this.api.get<FinancialSummary>('/finance/summary', options);
  }
}
