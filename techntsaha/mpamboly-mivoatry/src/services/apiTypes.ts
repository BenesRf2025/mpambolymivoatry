// Minimal API types used by the axios client

export type UUID = string;

export type User = {
  id: UUID;
  name?: string;
  phone?: string;
  roles?: string[];
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type IoTSensorNode = {
  id: UUID;
  name?: string;
  status?: 'online' | 'offline' | 'unknown';
  lastSeen?: string; // ISO
  soilMoisture?: number;
  battery?: number;
  location?: { lat: number; lon: number } | null;
};

export type Telemetry = {
  soilMoisture: number;
  battery?: number;
  timestamp: string; // ISO
};

export type TelemetryAck = {
  id: UUID;
  receivedAt: string;
};

export type MarketItem = {
  id: UUID;
  sellerId: UUID;
  sellerType?: string;
  name: string;
  description?: string;
  unit?: string;
  quantity?: number;
  price?: number;
  images?: string[];
  createdAt?: string;
};

export type NewListing = Omit<MarketItem, 'id' | 'createdAt'> & { sellerId: UUID };

export type Inspection = {
  id?: UUID;
  farmerId: UUID;
  cropId: UUID;
  photos?: string[];
  voiceNotes?: string[];
  notes?: string;
  location?: { lat: number; lon: number };
  createdAt?: string;
};

export type SyncAction = {
  type: string;
  clientId: string;
  payload: any;
};

export type SyncBatch = {
  actions: SyncAction[];
};

export type SyncResult = {
  applied: string[];
  errors: { clientId: string; message: string }[];
};
