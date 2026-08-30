// src/services/apiTypes.ts
// Minimal API types used by the axios client

export type UUID = string;

export type User = {
  id: UUID;
  name?: string;
  phone?: string;
  roles?: string[];
  familyId?: UUID;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type Parcel = {
  id: UUID;
  ownerUserId: UUID;
  name: string;
  areaM2: number;
  latitude?: number | null;
  longitude?: number | null;
  soilType?: string | null;
  createdAt?: string;
};

export type Crop = {
  id: UUID;
  parcelId: UUID;
  name: string;
  variety?: string | null;
  plantingDate: string;
  expectedHarvestDate?: string | null;
  status: string;
  estimatedYieldKg?: number | null;
  createdAt?: string;
};

export type Harvest = {
  id: UUID;
  cropId: UUID;
  harvestedAt: string;
  quantityKg: number;
  qualityGrade: string;
  status: string;
  createdAt?: string;
};

export type Inspection = {
  id: UUID;
  parcelId: UUID;
  inspectorUserId: UUID;
  status: string;
  observation?: string | null;
  voiceNoteUrl?: string | null;
  createdAt?: string;
  completedAt?: string | null;
};

export type Sensor = {
  id: UUID;
  ownerUserId: UUID;
  name: string;
  plotName: string;
  status?: string;
  batteryLevel?: number | null;
  soilMoisture?: number | null;
  soilTemperature?: number | null;
  airHumidity?: number | null;
  rainfallMmPerHour?: number | null;
  valveStatus?: string;
  autoMode?: boolean;
  lastTransmission?: string | null;
  smsAlertsEnabled?: boolean;
  signalStrength?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  recommendedActionFr?: string;
  recommendedActionMg?: string;
  createdAt?: string;
};

export type Telemetry = {
  soilMoisture: number;
  battery?: number | null;
  timestamp: string;
  soilTemperature?: number | null;
  airHumidity?: number | null;
  rainfallMmPerHour?: number | null;
};

export type Listing = {
  id: UUID;
  sellerUserId: UUID;
  sellerType?: string | null;
  name: string;
  description?: string | null;
  unit?: string | null;
  quantity?: number | null;
  price?: number | null;
  images?: string[] | null;
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

// Family types
export type Family = {
  id: UUID;
  name: string;
  headUserId?: string | null;
  createdAt?: string;
};

export type FamilyMember = {
  id: UUID;
  familyId: UUID;
  userId: UUID;
  userName: string;
  roleInFamily: string;
  joinedAt?: string;
};

export type FamilyToken = {
  id: UUID;
  token: string;
  familyId: UUID;
  createdBy: string;
  createdAt: string;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
};

export type ActivityActionType =
  | 'IRRIGATION'
  | 'INSPECTION'
  | 'SALE'
  | 'CROP_CREATE'
  | 'CROP_UPDATE'
  | 'HARVEST'
  | 'LISTING_CREATE'
  | 'SENSOR_UPDATE';

export type ActivityTrace = {
  id: UUID;
  familyId: UUID;
  userId: UUID;
  userName: string;
  actionType: ActivityActionType;
  entityType: string;
  entityId: UUID;
  details?: Record<string, any> | null;
  timestamp: string;
};

// Association types
export type Association = {
  id: UUID;
  name: string;
  description?: string | null;
  rules?: string | null;
  creatorId: string;
  createdAt: string;
};

export type AssociationMemberStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type AssociationMember = {
  id: UUID;
  associationId: UUID;
  familyId: UUID;
  userId: UUID;
  status: AssociationMemberStatus;
  joinedAt?: string | null;
  rejectedAt?: string | null;
  rejectionReason?: string | null;
  requestedAt?: string;
  association?: Association;
};
