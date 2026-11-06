export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  preferred_language: string;
  primary_role: 'FARMER' | 'AGRONOMIST' | 'CHC_OPERATOR' | 'ADMIN';
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: UserProfile;
}

export interface Farm {
  id: string;
  user_id: string;
  name: string;
  village: string;
  taluka: string;
  district: string;
  state: string;
  total_area_acres: number;
  area_unit: string;
  description?: string;
  latitude: number;
  longitude: number;
  soil_type: string;
  irrigation_source: string;
  boundary_geojson?: any;
  created_at: string;
  updated_at: string;
  fields_count?: number;
  total_cultivated_acres?: number;
}

export interface FarmCreatePayload {
  name: string;
  village: string;
  taluka: string;
  district: string;
  state?: string;
  total_area_acres: number;
  area_unit?: string;
  description?: string;
  latitude: number;
  longitude: number;
  soil_type?: string;
  irrigation_source?: string;
}

export interface FieldPlot {
  id: string;
  farm_id: string;
  farm_name?: string;
  name: string;
  area_acres: number;
  soil_type: string;
  soil_ph: number;
  location?: string;
  irrigation_type: string;
  description?: string;
  active_crop_name?: string;
  boundary_geojson?: any;
  created_at: string;
  updated_at: string;
}

export interface FieldCreatePayload {
  farm_id: string;
  name: string;
  area_acres: number;
  soil_type?: string;
  soil_ph?: number;
  location?: string;
  irrigation_type?: string;
  description?: string;
}

export interface Crop {
  id: string;
  field_id: string;
  field_name?: string;
  farm_id?: string;
  farm_name?: string;
  crop_name: string;
  crop_type: 'ONION' | 'SOYBEAN' | 'SUGARCANE' | 'WHEAT' | 'COTTON' | 'FALLOW';
  variety?: string;
  sowing_date: string;
  expected_harvest_date?: string;
  actual_harvest_date?: string;
  current_stage: 'SOWING' | 'VEGETATIVE' | 'FLOWERING' | 'MATURITY' | 'HARVESTED';
  cultivated_area?: number;
  expected_yield?: number;
  current_status: string;
  target_moisture_min: number;
  target_moisture_max: number;
  created_at: string;
  updated_at: string;
}

export interface CropCreatePayload {
  field_id: string;
  crop_name: string;
  crop_type: string;
  variety?: string;
  sowing_date: string;
  expected_harvest_date?: string;
  current_stage: string;
  cultivated_area?: number;
  expected_yield?: number;
  current_status?: string;
  target_moisture_min?: number;
  target_moisture_max?: number;
}

export interface CropDistributionItem {
  crop_name: string;
  variety?: string;
  area_acres: number;
  percentage: number;
}

export interface UpcomingActivityItem {
  id: string;
  title: string;
  activity_type: string;
  status: string;
  priority: string;
  scheduled_date: string;
  field_name?: string;
  crop_name?: string;
}

export interface MonthlyCashflowItem {
  month: string;
  income: number;
  expense: number;
}

export interface DashboardSummary {
  total_farms: number;
  total_fields: number;
  total_cultivated_acres: number;
  active_crops_count: number;
  total_expenses: number;
  recorded_income: number;
  estimated_profit: number;
  profit_margin_pct: number;
  crop_distribution: CropDistributionItem[];
  upcoming_activities: UpcomingActivityItem[];
  monthly_cashflow: MonthlyCashflowItem[];
  low_stock_alerts_count?: number;
  active_labour_count?: number;
  operational_machinery_count?: number;
  last_updated: string;
}

export interface FinancialTransaction {
  id: string;
  user_id: string;
  farm_id: string;
  crop_id?: string;
  transaction_type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  transaction_date: string;
  payment_method: string;
  invoice_number?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface FinancialCategorySummary {
  category: string;
  total_amount: number;
  percentage: number;
}

export interface MonthlyFlow {
  month: string;
  income: number;
  expense: number;
  net: number;
}

export interface FinancialSummary {
  total_income: number;
  total_expenses: number;
  net_profit: number;
  profit_margin_pct: number;
  income_categories: FinancialCategorySummary[];
  expense_categories: FinancialCategorySummary[];
  monthly_flow: MonthlyFlow[];
}

export interface FarmActivity {
  id: string;
  farm_id: string;
  field_id?: string;
  crop_id?: string;
  title: string;
  activity_type: string;
  status: string;
  priority: string;
  scheduled_date: string;
  completed_date?: string;
  cost: number;
  assigned_to?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  link_url?: string;
  created_at: string;
}

export interface InventoryItem {
  id: string;
  farm_id: string;
  name: string;
  category: string;
  unit: string;
  current_stock: number;
  reorder_level: number;
  unit_price: number;
  supplier?: string;
  batch_number?: string;
  expiry_date?: string;
  is_low_stock?: boolean;
  created_at: string;
  updated_at: string;
}

export interface InventoryTransaction {
  id: string;
  item_id: string;
  transaction_type: 'INWARD' | 'OUTWARD' | 'ADJUSTMENT';
  quantity: number;
  unit_price: number;
  total_cost: number;
  transaction_date: string;
  reference_activity_id?: string;
  notes?: string;
  created_at: string;
}

export interface LowStockAlert {
  item_id: string;
  name: string;
  category: string;
  current_stock: number;
  reorder_level: number;
  unit: string;
  urgency: 'CRITICAL' | 'WARNING';
}

export interface LabourWorker {
  id: string;
  farm_id: string;
  full_name: string;
  phone_number?: string;
  skill_type: string;
  daily_wage: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LabourAttendance {
  id: string;
  labour_id: string;
  farm_id: string;
  attendance_date: string;
  status: 'PRESENT' | 'HALF_DAY' | 'ABSENT';
  hours_worked: number;
  wage_paid: number;
  notes?: string;
  created_at: string;
  worker_name?: string;
}

export interface LabourSummary {
  total_workers: number;
  active_workers: number;
  today_present: number;
  today_half_day: number;
  today_absent: number;
  month_to_date_wages: number;
}

export interface EquipmentItem {
  id: string;
  farm_id: string;
  name: string;
  equipment_type: string;
  model_number?: string;
  serial_number?: string;
  purchase_date?: string;
  purchase_price: number;
  status: 'OPERATIONAL' | 'MAINTENANCE' | 'RETIRED';
  next_service_due?: string;
  maintenance_count?: number;
  created_at: string;
  updated_at: string;
}

export interface EquipmentMaintenance {
  id: string;
  equipment_id: string;
  maintenance_date: string;
  service_type: string;
  cost: number;
  description: string;
  technician_name?: string;
  next_service_due?: string;
  created_at: string;
  equipment_name?: string;
}

export interface EquipmentSummary {
  total_equipment: number;
  operational_count: number;
  maintenance_count: number;
  retired_count: number;
  upcoming_services_count: number;
}

export interface CropPerformanceSummary {
  total_active_crops: number;
  total_cultivated_area: number;
  stages_breakdown: Record<string, number>;
  crops: {
    crop_id: string;
    crop_name: string;
    variety?: string;
    cultivated_area: number;
    current_stage: string;
    expected_yield?: number;
    actual_yield?: number;
    yield_efficiency_pct?: number;
    status: string;
  }[];
}
