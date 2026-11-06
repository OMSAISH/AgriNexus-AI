import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // 1. Public Landing Page
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./features/landing/landing.component').then(m => m.LandingComponent),
    title: 'AgriNexus AI — Smarter Farming. Better Decisions. Sustainable Growth.',
  },

  // 2. Public Authentication Routes
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent),
    title: 'AgriNexus AI — Farmer & Operator Login',
  },
  {
    path: 'auth/register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(m => m.RegisterComponent),
    title: 'AgriNexus AI — Register Account',
  },
  {
    path: 'auth/forgot-password',
    loadComponent: () =>
      import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
    title: 'AgriNexus AI — Password Recovery',
  },
  {
    path: 'auth/reset-password',
    loadComponent: () =>
      import('./features/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
    title: 'AgriNexus AI — Set New Password',
  },

  // 3. Authenticated Enterprise Application Shell Routes
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'AgriNexus AI — Farm Operations Twin',
      },
      {
        path: 'farms',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/farms/farms.component').then(m => m.FarmManagementComponent),
        title: 'AgriNexus AI — Farm Holdings',
      },
      {
        path: 'fields',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/fields/fields.component').then(m => m.FieldManagementComponent),
        title: 'AgriNexus AI — Field Parcels & GIS Polygons',
      },
      {
        path: 'crops',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/crops/crops.component').then(m => m.CropManagementComponent),
        title: 'AgriNexus AI — Crop Portfolio',
      },
      {
        path: 'crop-doctor',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/crop-doctor/crop-doctor.component').then(m => m.AICropDoctorComponent),
        title: 'AgriNexus AI — AI Crop Doctor & Leaf Pathology',
      },
      {
        path: 'irrigation',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/irrigation/irrigation.component').then(m => m.IrrigationComponent),
        title: 'AgriNexus AI — Smart Irrigation & Moisture Telemetry',
      },
      {
        path: 'weather',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/weather/weather.component').then(m => m.WeatherComponent),
        title: 'AgriNexus AI — Microclimate & Spray Advisories',
      },
      {
        path: 'crop-lifecycle',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/crop-lifecycle/crop-lifecycle.component').then(m => m.CropLifecycleComponent),
        title: 'AgriNexus AI — Crop Lifecycle & GDD',
      },
      {
        path: 'inventory',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/inventory/inventory.component').then(m => m.InventoryComponent),
        title: 'AgriNexus AI — Input Stock & Inventory',
      },
      {
        path: 'labour',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/labour/labour.component').then(m => m.LabourComponent),
        title: 'AgriNexus AI — Workforce & Muster Roll',
      },
      {
        path: 'equipment',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/equipment/equipment.component').then(m => m.EquipmentComponent),
        title: 'AgriNexus AI — Machinery & Maintenance',
      },
      {
        path: 'market-intelligence',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/market-intelligence/market-intelligence.component').then(m => m.MarketIntelligenceComponent),
        title: 'AgriNexus AI — APMC Mandi Intelligence',
      },
      {
        path: 'financials',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/financials/financials.component').then(m => m.FinancialManagementComponent),
        title: 'AgriNexus AI — Financial Ledger & Crop Profitability',
      },
      {
        path: 'reports',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/reports/reports.component').then(m => m.ReportsComponent),
        title: 'AgriNexus AI — Agricultural Reports & Compliance',
      },
      {
        path: 'notifications',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/notifications/notifications.component').then(m => m.NotificationsComponent),
        title: 'AgriNexus AI — Farm Notification Center',
      },
      {
        path: 'settings',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/settings/settings.component').then(m => m.SettingsComponent),
        title: 'AgriNexus AI — Platform & Regional Settings',
      },
      {
        path: 'system-status',
        loadComponent: () =>
          import('./features/system-status/system-status.component').then(m => m.SystemStatusComponent),
        title: 'AgriNexus AI — System Diagnostics Probe',
      },
    ],
  },

  // 4. Fallback 404
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'AgriNexus AI — Page Not Found',
  },
];
