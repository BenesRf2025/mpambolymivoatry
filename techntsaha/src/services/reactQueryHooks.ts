import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAuthToken,
  setAuthToken,
  setBaseURL,
  login,
  register,
  registerWithFamilyToken,
  getMe,
  getParcels,
  getParcel,
  createParcel,
  getCrops,
  getCrop,
  createCrop,
  getHarvests,
  createHarvest,
  getInspections,
  createInspection,
  completeInspection,
  getAdvice,
  getSensors,
  postTelemetry,
  getListings,
  createListing,
  syncBatch,
} from './apiClient';
import type {
  AuthResponse,
  User,
  Parcel,
  Crop,
  Harvest,
  Inspection,
  Sensor,
  Telemetry,
  Listing,
  SyncBatch as SyncBatchType,
  SyncResult,
} from './apiTypes';

// Auth
export function useLogin() {
  const qc = useQueryClient();
  return useMutation<AuthResponse, Error, { phone: string; password: string }>({
    mutationFn: ({ phone, password }) => login(phone, password),
    onSuccess: (data) => {
      setAuthToken(data.token);
      qc.invalidateQueries();
    },
  });
}

export function useMe(enabled = true) {
  return useQuery<User>({
    queryKey: ['me'],
    queryFn: () => getMe(),
    enabled,
  });
}

// Parcels
export function useParcels() {
  return useQuery<Parcel[]>({
    queryKey: ['parcels'],
    queryFn: () => getParcels(),
  });
}

export function useParcel(id: string) {
  return useQuery<Parcel>({
    queryKey: ['parcel', id],
    queryFn: () => getParcel(id),
    enabled: !!id,
  });
}

export function useCreateParcel() {
  const qc = useQueryClient();
  return useMutation<Parcel, Error, Omit<Parcel, 'id' | 'createdAt'>>({
    mutationFn: (payload) => createParcel(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['parcels'] }),
  });
}

// Crops
export function useCrops(parcelId?: string) {
  return useQuery<Crop[]>({
    queryKey: ['crops', parcelId],
    queryFn: () => getCrops(parcelId),
  });
}

export function useCrop(id: string) {
  return useQuery<Crop>({
    queryKey: ['crop', id],
    queryFn: () => getCrop(id),
    enabled: !!id,
  });
}

export function useCreateCrop() {
  const qc = useQueryClient();
  return useMutation<Crop, Error, Omit<Crop, 'id' | 'createdAt'>>({
    mutationFn: (payload) => createCrop(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['crops'] }),
  });
}

// Harvests
export function useHarvests() {
  return useQuery<Harvest[]>({
    queryKey: ['harvests'],
    queryFn: () => getHarvests(),
  });
}

export function useCreateHarvest() {
  const qc = useQueryClient();
  return useMutation<Harvest, Error, Omit<Harvest, 'id' | 'createdAt'>>({
    mutationFn: (payload) => createHarvest(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['harvests'] }),
  });
}

// Inspections
export function useInspections(parcelId?: string) {
  return useQuery<Inspection[]>({
    queryKey: ['inspections', parcelId],
    queryFn: () => getInspections(parcelId),
  });
}

export function useCreateInspection() {
  const qc = useQueryClient();
  return useMutation<Inspection, Error, Omit<Inspection, 'id' | 'createdAt'>>({
    mutationFn: (payload) => createInspection(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inspections'] }),
  });
}

export function useCompleteInspection() {
  const qc = useQueryClient();
  return useMutation<Inspection, Error, { id: string; observation?: string }>({
    mutationFn: ({ id, observation }) => completeInspection(id, { observation }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inspections'] }),
  });
}

export function useAdvice() {
  return useQuery<{ advice: string }>({
    queryKey: ['advice'],
    queryFn: () => getAdvice(),
  });
}

// Sensors
export function useSensors() {
  return useQuery<Sensor[]>({
    queryKey: ['sensors'],
    queryFn: () => getSensors(),
  });
}

export function usePostTelemetry() {
  const qc = useQueryClient();
  return useMutation<{ id: string; receivedAt: string }, Error, { sensorId: string; payload: Telemetry }>({
    mutationFn: ({ sensorId, payload }) => postTelemetry(sensorId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sensors'] }),
  });
}

// Listings
export function useListings() {
  return useQuery<Listing[]>({
    queryKey: ['listings'],
    queryFn: () => getListings(),
  });
}

export function useCreateListing() {
  const qc = useQueryClient();
  return useMutation<Listing, Error, Omit<Listing, 'id' | 'createdAt'>>({
    mutationFn: (payload) => createListing(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['listings'] }),
  });
}

// Sync
export function useSyncBatch() {
  const qc = useQueryClient();
  return useMutation<SyncResult, Error, SyncBatchType>({
    mutationFn: (payload) => syncBatch(payload),
    onSuccess: () => qc.invalidateQueries(),
  });
}

// Utility: set base URL or token programmatically
export function setApiBaseURL(url: string) {
  setBaseURL(url);
}

export function setApiAuthToken(token: string | null) {
  setAuthToken(token);
}

export { getAuthToken };
