import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import {
  AuthResponse,
  IoTSensorNode,
  Telemetry,
  TelemetryAck,
  MarketItem,
  NewListing,
  Inspection,
  SyncBatch,
  SyncResult,
  User,
} from './apiTypes';

const DEFAULT_BASE = 'https://api.example.com';

class APIClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor(baseURL = DEFAULT_BASE) {
    this.client = axios.create({
      baseURL,
      timeout: 30_000,
      headers: { 'Content-Type': 'application/json' },
    });

    this.client.interceptors.request.use((cfg: InternalAxiosRequestConfig) => {
      if (this.token) {
        const prev = (cfg.headers as Record<string, unknown>) || {};
        cfg.headers = { ...prev, Authorization: `Bearer ${this.token}` } as any;
      }
      return cfg;
    });
  }

  setBaseURL(url: string) {
    this.client.defaults.baseURL = url;
  }

  setAuthToken(token: string | null) {
    this.token = token;
  }

  // Auth
  async login(phone: string, password: string): Promise<AuthResponse> {
    const { data } = await this.client.post<AuthResponse>('/api/auth/login', { phone, password });
    return data;
  }

  // User
  async getMe(): Promise<User> {
    const { data } = await this.client.get<User>('/api/me');
    return data;
  }

  // Sensors
  async getSensors(): Promise<IoTSensorNode[]> {
    const { data } = await this.client.get<IoTSensorNode[]>('/api/sensors');
    return data;
  }

  async postTelemetry(sensorId: string, payload: Telemetry): Promise<TelemetryAck> {
    const { data } = await this.client.post<TelemetryAck>(`/api/sensors/${sensorId}/telemetry`, payload);
    return data;
  }

  // Listings
  async getListings(): Promise<MarketItem[]> {
    const { data } = await this.client.get<MarketItem[]>('/api/listings');
    return data;
  }

  async createListing(payload: NewListing): Promise<MarketItem> {
    const { data } = await this.client.post<MarketItem>('/api/listings', payload);
    return data;
  }

  // Inspections
  async createInspection(payload: Inspection): Promise<Inspection> {
    const { data } = await this.client.post<Inspection>('/api/inspections', payload);
    return data;
  }

  // Sync batch
  async syncBatch(payload: SyncBatch): Promise<SyncResult> {
    const { data } = await this.client.post<SyncResult>('/api/sync/batch', payload);
    return data;
  }
}

export const api = new APIClient();
export default api;
