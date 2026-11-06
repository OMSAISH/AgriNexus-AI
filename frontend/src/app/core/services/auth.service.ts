import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { AuthResponse, UserProfile } from '../models/agrinexus.models';

const TOKEN_KEY = 'agrinexus_access_token';
const REFRESH_KEY = 'agrinexus_refresh_token';
const USER_KEY = 'agrinexus_user_profile';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  private readonly _currentUser = signal<UserProfile | null>(this.loadUserFromStorage());
  private readonly _token = signal<string | null>(this.loadTokenFromStorage());

  public readonly currentUser = this._currentUser.asReadonly();
  public readonly isAuthenticated = computed(() => !!this._token());
  public readonly userRole = computed(() => this._currentUser()?.primary_role || null);
  public readonly userName = computed(() => this._currentUser()?.full_name || 'Farmer');
  public readonly userEmail = computed(() => this._currentUser()?.email || '');

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/auth/login', credentials).pipe(
      tap(response => {
        this.saveSession(response.access_token, response.refresh_token, response.user);
      })
    );
  }

  register(userData: {
    email: string;
    password: string;
    full_name: string;
    phone_number?: string;
    preferred_language?: string;
    role: string;
  }): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/auth/register', userData).pipe(
      tap(response => {
        this.saveSession(response.access_token, response.refresh_token, response.user);
      })
    );
  }

  fetchUserProfile(): Observable<UserProfile> {
    return this.api.get<UserProfile>('/auth/me').pipe(
      tap(user => {
        this._currentUser.set(user);
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(USER_KEY, JSON.stringify(user));
        }
      })
    );
  }

  logout(): void {
    if (this._token()) {
      this.api.post('/auth/logout', {}).subscribe({
        error: () => {} // ignore network error on logout
      });
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_KEY);
      localStorage.removeItem(USER_KEY);
    }
    this._token.set(null);
    this._currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  public saveSession(token: string, refreshToken: string, user: UserProfile): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(REFRESH_KEY, refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    this._token.set(token);
    this._currentUser.set(user);
  }

  private loadTokenFromStorage(): string | null {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  }

  private loadUserFromStorage(): UserProfile | null {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserProfile;
    } catch {
      return null;
    }
  }
}
