import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import {
  AuthResponse,
  User,
  Parcel,
  Crop,
  Harvest,
  Inspection,
  Sensor,
  Telemetry,
  Listing,
  SyncBatch,
  SyncResult,
  Family,
  FamilyMember,
  ActivityTrace,
  Association,
  AssociationMember,
  AssociationType,
  AssociationMemberRole,
  CollectiveStock,
} from './apiTypes';

const DEFAULT_BASE = 'http://localhost:3000';

const api = axios.create({ baseURL: DEFAULT_BASE });

api.interceptors.request.use((cfg: InternalAxiosRequestConfig) => {
  const token = (cfg as any)._authToken;
  if (token) {
    const prev = (cfg.headers as Record<string, unknown>) || {};
    cfg.headers = { ...prev, Authorization: `Bearer ${token}` } as any;
  }
  return cfg;
});

export const setAuthToken = (token: string | null) => {
  (api as any)._authToken = token;
};

export const setBaseURL = (url: string) => {
  (api as any).defaults.baseURL = url;
};

// Auth
export const login = async (phone: string, password: string): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/api/auth/login', { phone, password });
  return data;
};

export const register = async (payload: { fullName: string; phoneNumber: string; password: string; roles: string[] }): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/api/auth/register', payload);
  return data;
};

export const registerWithFamilyToken = async (payload: { fullName: string; phoneNumber: string; password: string; roles: string[]; familyToken: string }): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/api/family/register', payload);
  return data;
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>('/api/auth/me');
  return data;
};

// Parcels
export const getParcels = async (): Promise<Parcel[]> => {
  const { data } = await api.get<Parcel[]>('/api/parcels');
  return data;
};

export const getParcel = async (id: string): Promise<Parcel> => {
  const { data } = await api.get<Parcel>(`/api/parcels/${id}`);
  return data;
};

export const createParcel = async (payload: Omit<Parcel, 'id' | 'createdAt'>): Promise<Parcel> => {
  const { data } = await api.post<Parcel>('/api/parcels', payload);
  return data;
};

// Crops
export const getCrops = async (parcelId?: string): Promise<Crop[]> => {
  const { data } = await api.get<Crop[]>('/api/crops', { params: { parcelId } });
  return data;
};

export const getCrop = async (id: string): Promise<Crop> => {
  const { data } = await api.get<Crop>(`/api/crops/${id}`);
  return data;
};

export const createCrop = async (payload: Omit<Crop, 'id' | 'createdAt'>): Promise<Crop> => {
  const { data } = await api.post<Crop>('/api/crops', payload);
  return data;
};

// Harvests
export const getHarvests = async (): Promise<Harvest[]> => {
  const { data } = await api.get<Harvest[]>('/api/harvests/available');
  return data;
};

export const createHarvest = async (payload: Omit<Harvest, 'id' | 'createdAt'>): Promise<Harvest> => {
  const { data } = await api.post<Harvest>('/api/harvests', payload);
  return data;
};

// Inspections
export const getInspections = async (parcelId?: string): Promise<Inspection[]> => {
  const { data } = await api.get<Inspection[]>('/api/inspections', { params: { parcelId } });
  return data;
};

export const createInspection = async (payload: Omit<Inspection, 'id' | 'createdAt'>): Promise<Inspection> => {
  const { data } = await api.post<Inspection>('/api/inspections', payload);
  return data;
};

export const completeInspection = async (id: string, payload: { observation?: string }): Promise<Inspection> => {
  const { data } = await api.patch<Inspection>(`/api/inspections/${id}/complete`, payload);
  return data;
};

export const getAdvice = async (): Promise<{ advice: string }> => {
  const { data } = await api.get<{ advice: string }>('/api/inspections/advice');
  return data;
};

// Sensors
export const getSensors = async (): Promise<Sensor[]> => {
  const { data } = await api.get<Sensor[]>('/api/sensors');
  return data;
};

export const postTelemetry = async (sensorId: string, payload: Telemetry): Promise<{ id: string; receivedAt: string }> => {
  const { data } = await api.post<{ id: string; receivedAt: string }>(`/api/sensors/${sensorId}/telemetry`, payload);
  return data;
};

// Listings
export const getListings = async (): Promise<Listing[]> => {
  const { data } = await api.get<Listing[]>('/api/listings');
  return data;
};

export const createListing = async (payload: Omit<Listing, 'id' | 'createdAt'>): Promise<Listing> => {
  const { data } = await api.post<Listing>('/api/listings', payload);
  return data;
};

// Sync batch
export const syncBatch = async (payload: SyncBatch): Promise<SyncResult> => {
  const { data } = await api.post<SyncResult>('/api/sync/batch', payload);
  return data;
};

export const getAuthToken = (): string | null => (api as any)._authToken || null;

// Family
export const createFamily = async (payload: { name: string; headUserId?: string }, token: string): Promise<Family> => {
  const { data } = await api.post<Family>('/api/family/create', payload, { headers: { Authorization: `Bearer ${token}` } });
  return data;
};

export const generateFamilyToken = async (familyId: string, token: string, maxUses?: number): Promise<{ token: string }> => {
  const { data } = await api.post<{ token: string }>('/api/family/token/generate', { familyId, maxUses }, { headers: { Authorization: `Bearer ${token}` } });
  return data;
};

export const getFamilyMembers = async (token: string): Promise<FamilyMember[]> => {
  const { data } = await api.get<FamilyMember[]>('/api/family/members', { headers: { Authorization: `Bearer ${token}` } });
  return data;
};

export const getFamilyActivities = async (token: string): Promise<ActivityTrace[]> => {
  const { data } = await api.get<ActivityTrace[]>('/api/family/activities', { headers: { Authorization: `Bearer ${token}` } });
  return data;
};

export const getMyFamily = async (token: string): Promise<Family | null> => {
  const { data } = await api.get<Family | null>('/api/family/my', { headers: { Authorization: `Bearer ${token}` } });
  return data;
};

// Associations (backend: /api/associations)
export const createAssociation = async (
  payload: { name: string; type: AssociationType; description?: string; location?: string; registrationNumber?: string },
  token: string,
): Promise<Association> => {
  const { data } = await api.post<Association>('/api/associations', payload, { headers: { Authorization: `Bearer ${token}` } });
  return data;
};

export const getAllAssociations = async (): Promise<Association[]> => {
  const { data } = await api.get<Association[]>('/api/associations');
  return data;
};

export const getMyMemberships = async (token: string): Promise<AssociationMember[]> => {
  const { data } = await api.get<AssociationMember[]>('/api/associations/me/list', { headers: { Authorization: `Bearer ${token}` } });
  return data;
};

export const getAssociationById = async (id: string): Promise<Association> => {
  const { data } = await api.get<Association>(`/api/associations/${id}`);
  return data;
};

export const getCollectiveStock = async (id: string): Promise<CollectiveStock> => {
  const { data } = await api.get<CollectiveStock>(`/api/associations/${id}/stock`);
  return data;
};

export const joinAssociation = async (associationId: string, token: string): Promise<AssociationMember> => {
  const { data } = await api.post<AssociationMember>(
    `/api/associations/${associationId}/join`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data;
};

export const leaveAssociation = async (associationId: string, token: string): Promise<void> => {
  await api.delete(`/api/associations/${associationId}/leave`, { headers: { Authorization: `Bearer ${token}` } });
};

export const updateMemberRole = async (
  associationId: string,
  userId: string,
  memberRole: AssociationMemberRole,
  token: string,
): Promise<AssociationMember> => {
  const { data } = await api.patch<AssociationMember>(
    `/api/associations/${associationId}/members/${userId}/role`,
    { memberRole },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data;
};

export const updateMemberRevenue = async (
  associationId: string,
  userId: string,
  revenuePercentage: number,
  token: string,
): Promise<AssociationMember> => {
  const { data } = await api.patch<AssociationMember>(
    `/api/associations/${associationId}/members/${userId}/revenue-percentage`,
    { revenuePercentage },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data;
};

export const removeMember = async (associationId: string, userId: string, token: string): Promise<void> => {
  await api.delete(`/api/associations/${associationId}/members/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
};

export default api;
