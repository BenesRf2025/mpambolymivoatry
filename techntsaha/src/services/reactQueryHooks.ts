import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './apiClient';
import type {
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

// NOTE: Ensure `@tanstack/react-query` is installed in the project.

// Auth
export function useLogin() {
  const qc = useQueryClient();
  return useMutation< AuthResponse, any, { phone: string; password: string }>(
    ({ phone, password }) => api.login(phone, password),
    {
      onSuccess: (data) => {
        api.setAuthToken(data.token);
        qc.invalidateQueries();
      },
    }
  );
}

export function useMe(enabled = true) {
  return useQuery<User>(['me'], () => api.getMe(), { enabled });
}

// Sensors
export function useSensors() {
  return useQuery<IoTSensorNode[]>(['sensors'], () => api.getSensors());
}

export function usePostTelemetry() {
  const qc = useQueryClient();
  return useMutation<TelemetryAck, any, { sensorId: string; payload: Telemetry }>(
    ({ sensorId, payload }) => api.postTelemetry(sensorId, payload),
    {
      onSuccess: () => qc.invalidateQueries(['sensors']),
    }
  );
}

// Listings
export function useListings() {
  return useQuery<MarketItem[]>(['listings'], () => api.getListings());
}

export function useCreateListing() {
  const qc = useQueryClient();
  return useMutation<MarketItem, any, NewListing>(
    (payload) => api.createListing(payload),
    {
      onSuccess: () => qc.invalidateQueries(['listings']),
    }
  );
}

// Inspections
export function useCreateInspection() {
  const qc = useQueryClient();
  return useMutation<Inspection, any, Inspection>((payload) => api.createInspection(payload), {
    onSuccess: () => qc.invalidateQueries(['inspections']),
  });
}

// Sync
export function useSyncBatch() {
  const qc = useQueryClient();
  return useMutation<SyncResult, any, SyncBatch>(
    (payload) => api.syncBatch(payload),
    {
      onSuccess: () => qc.invalidateQueries(),
    }
  );
}

// Utility: set base URL or token programmatically
export function setApiBaseURL(url: string) {
  api.setBaseURL(url);
}

export function setApiAuthToken(token: string | null) {
  api.setAuthToken(token);
}

// Example usage (in a component):
// const login = useLogin();
// login.mutate({ phone: '+26133...', password: 'pw' });
