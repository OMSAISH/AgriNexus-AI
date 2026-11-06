import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { NotificationItem } from '../models/agrinexus.models';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly api = inject(ApiService);

  getNotifications(): Observable<NotificationItem[]> {
    return this.api.get<NotificationItem[]>('/notifications');
  }

  markAsRead(notificationId: string): Observable<NotificationItem> {
    return this.api.patch<NotificationItem>(`/notifications/${notificationId}/read`, {});
  }
}
