export interface HealthCheckResponse {
  success: boolean;
  status: string;
  timestamp: string;
  service: string;
  environment: string;
  version: string;
}

export interface DatabaseHealthResponse {
  success: boolean;
  status: string;
  timestamp: string;
  database_type: string;
  database_name: string;
  version?: string;
  latency_ms?: number;
  error?: string;
  diagnostics?: {
    server_host?: string;
    server_port?: number;
    database_time?: string;
    pool_size?: number;
    recommendation?: string;
  };
}

export interface UserResponse {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  primary_role: 'FARMER' | 'AGRONOMIST' | 'CHC_OPERATOR' | 'ADMIN';
  is_active: boolean;
  created_at: string;
}

export interface AuthTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: UserResponse;
}
