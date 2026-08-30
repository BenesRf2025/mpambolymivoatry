export type Language = 'fr' | 'mg';

// User Roles defined in MpambolyMivoatry Presentation
export type UserRole = 'all' | 'agriculteur' | 'vendeur' | 'commercant' | 'acheteur' | 'association' | 'administrateur';

export type ScreenType = 
  | 'home' 
  | 'market' 
  | 'diagnostic' 
  | 'guides' 
  | 'management'
  | 'smart_irrigation'
  | 'field_inspection'
  | 'seller_shop'
  | 'buyer_hub'
  | 'association'
  | 'family_overview'
  | 'associations'
  | 'admin'
  | 'logout';

export type CropStage = 'semis' | 'croissance' | 'floraison' | 'maturation' | 'recolte';

export interface Crop {
  id: string;
  name: string;
  malagasyName: string;
  variety: string;
  plotName: string;
  surfaceArea: number; // in hectares or ares
  surfaceUnit: 'ha' | 'ares';
  plantingDate: string;
  expectedHarvestDate: string;
  stage: CropStage;
  progressPercent: number;
  healthScore: number; // 0 - 100
  soilMoisture: number; // 0 - 100%
  nextActionFr: string;
  nextActionMg: string;
  icon: string;
  color: string;
  region: string;
  notes?: string;
  harvestYieldKg?: number;
  daysToHarvest: number;
  allocatedToShop?: number; // kg listed for direct sale
  allocatedToCoop?: number; // kg given to collective mutualized stock
}

// Smart Irrigation & IoT Sensor types (Slide 3 & 7)
export interface IoTSensorNode {
  id: string;
  name: string;
  plotName: string;
  status?: 'online' | 'offline' | 'unknown';
  batteryLevel: number; // % (Solar powered <30 USD)
  soilMoisture: number; // %
  soilTemperature: number; // °C
  airHumidity: number; // %
  rainfallMmPerHour: number; // mm/h
  valveStatus: 'open' | 'closed' | 'auto';
  autoMode: boolean;
  lastTransmission: string;
  smsAlertsEnabled: boolean; // SMS offline alerts
  signalStrength: '4G' | '2G' | 'LoRa' | 'SMS';
  recommendedActionFr: string;
  recommendedActionMg: string;
}

// Field Inspection types (Slide 3 & 7)
export interface FieldInspectionRound {
  id: string;
  plotName: string;
  inspectorName: string;
  date: string;
  status: 'completed' | 'in_progress' | 'scheduled';
  overallHealthScore: number;
  stationsChecked: number;
  totalStations: number;
  photos: string[];
  audioNotesCount: number;
  observationsFr: string[];
  observationsMg: string[];
  actionRequired: boolean;
  syncedToCoop: boolean;
}

export type MarketCategory = 'all' | 'recoltes' | 'semences' | 'engrais_outils' | 'elevage';

// Buyer categories (Slide 5)
export type BuyerSegment = 'particulier' | 'epicerie' | 'restaurant' | 'export';

export interface MarketItem {
  id: string;
  title: string;
  malagasyTitle: string;
  category: 'recoltes' | 'semences' | 'engrais_outils' | 'elevage';
  price: number; // in Ariary
  unit: string; // 'kg', 'sac 50kg', 'litre', 'unité', 'tonne'
  location: string;
  region: string;
  sellerName: string;
  sellerType: 'producteur' | 'association' | 'commercant';
  sellerPhone: string;
  sellerWhatsapp?: string;
  verifiedSeller: boolean;
  inStock: boolean;
  stockAmount: string;
  stockKg?: number;
  imageUrl: string;
  datePosted: string;
  description: string;
  malagasyDescription: string;
  badge?: string;
  targetBuyers?: BuyerSegment[];
  bulkDiscount?: {
    minQuantity: number;
    discountPercent: number;
  };
}

// Direct Order & Commerce types (Slide 3, 5, 6)
export interface InAppOrder {
  id: string;
  orderNumber: string;
  buyerName: string;
  buyerPhone: string;
  buyerSegment: BuyerSegment;
  sellerName: string;
  items: Array<{
    title: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    subtotal: number;
  }>;
  totalAmount: number; // Ar
  paymentMethod: 'mvola' | 'orange_money' | 'airtel_money' | 'cash_delivery';
  paymentStatus: 'pending' | 'paid' | 'transferred_to_farmer';
  deliveryStatus: 'order_placed' | 'preparing' | 'in_transit' | 'delivered';
  deliveryPartner?: {
    name: string;
    phone: string;
    vehicleType: string;
  };
  deliveryFee: number;
  date: string;
  deliveryAddress: string;
}

// In-app direct messaging for buyer-seller negotiations
export interface ChatMessage {
  id: string;
  senderRole: 'buyer' | 'seller' | 'association';
  senderName: string;
  text: string;
  timestamp: string;
  isOfferProposal?: boolean;
  proposedPrice?: number;
  proposedQuantity?: number;
  offerStatus?: 'pending' | 'accepted' | 'declined';
}

export interface ChatThread {
  id: string;
  buyerName: string;
  sellerName: string;
  productTitle: string;
  unreadCount: number;
  lastMessage: string;
  lastUpdated: string;
  messages: ChatMessage[];
}

// Association & Cooperative types (Slide 4 & 6)
export type AssociationStructureType = 'family' | 'neighborhood' | 'cooperative';

export interface CoopMember {
  id: string;
  name: string;
  roleInCoop: string;
  fokontany: string;
  phone: string;
  cropsCount: number;
  contributedKgThisMonth: number;
  allocatedRevenueAr: number;
  paymentStatus: 'paid_mvola' | 'pending';
  avatarUrl?: string;
}

export interface MutualizedStockItem {
  id: string;
  cropName: string;
  malagasyName: string;
  totalVolumeTonnes: number;
  contributingMembersCount: number;
  targetWholesalePrice: number; // Ar / kg
  reservedVolumeTonnes: number;
  availableVolumeTonnes: number;
  buyerInNegotiation?: string;
  qualityGrade: 'A+' | 'A' | 'B';
}

export interface CooperativeGroup {
  id: string;
  name: string;
  structureType: AssociationStructureType;
  structureLabelFr: string;
  structureLabelMg: string;
  location: string;
  region: string;
  totalMembers: number;
  totalHectares: number;
  collectiveStockTonnes: number;
  activeNegotiationsCount: number;
  monthlyGroupRevenueAr: number;
  fairShareSplitPercentage: number; // 95% to members, 5% solidarity fund
  institutionalAccessCertified: boolean;
  members: CoopMember[];
  mutualizedStock: MutualizedStockItem[];
}

export interface CommodityPrice {
  id: string;
  name: string;
  malagasyName: string;
  currentPrice: number; // Ar / kg
  previousPrice: number;
  unit: string;
  marketLocation: string;
  trend: 'up' | 'down' | 'stable';
  variationPercent: number;
  category: string;
}

export interface WeatherInfo {
  region: string;
  currentTemp: number;
  conditionFr: string;
  conditionMg: string;
  humidity: number;
  windSpeed: number; // km/h
  rainProbability: number; // %
  soilCondition: string;
  uvIndex: number;
  agroAdviceFr: string;
  agroAdviceMg: string;
  forecast: Array<{
    day: string;
    malagasyDay: string;
    tempMax: number;
    tempMin: number;
    rainProb: number;
    condition: string;
    icon: string;
  }>;
}

export interface ExpertTip {
  id: string;
  titleFr: string;
  titleMg: string;
  category: string;
  categoryFr: string;
  categoryMg: string;
  badgeFr: string;
  badgeMg: string;
  summaryFr: string;
  summaryMg: string;
  contentFr: string;
  contentMg: string;
  stepsFr: string[];
  stepsMg: string[];
  icon: string;
  readTimeMin: number;
  isDailyFeatured?: boolean;
}

export interface PlantDiagnostic {
  id: string;
  cropName: string;
  identifiedIssue: string;
  malagasyIssue: string;
  issueType: 'disease' | 'pest' | 'nutrient_deficiency' | 'environmental';
  severity: 'low' | 'moderate' | 'high' | 'critical';
  confidence: number;
  symptomsSummary: string;
  organicTreatment: string[];
  chemicalTreatment?: string[];
  prevention: string[];
  malagasyAdvice: string;
  expertNote: string;
  dateAnalyzed: string;
  imageUrl?: string;
}

export interface FinancialEntry {
  id: string;
  type: 'income' | 'expense';
  category: 'vente_recolte' | 'semence' | 'engrais' | 'main_oeuvre' | 'transport' | 'materiel' | 'autre';
  description: string;
  amount: number; // in Ariary
  date: string;
  cropRelated?: string;
}

export interface FarmerProfile {
  name: string;
  phone: string;
  location: string;
  region: string;
  associationName?: string;
  cooperative: string;
  totalLandArea: string;
  avatarUrl?: string;
  memberSince: string;
  activeRole: UserRole;
  shopName?: string;
  mvolaNumber?: string;
  orangeMoneyNumber?: string;
  familyId?: string;
}

// Family types
export interface Family {
  id: string;
  name: string;
  headUserId?: string | null;
  createdAt?: string;
}

export interface FamilyMember {
  id: string;
  familyId: string;
  userId: string;
  userName: string;
  roleInFamily: string;
  joinedAt?: string;
}

export interface FamilyToken {
  id: string;
  token: string;
  familyId: string;
  createdBy: string;
  createdAt: string;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
}

export type ActivityActionType = 'IRRIGATION' | 'INSPECTION' | 'SALE' | 'CROP_CREATE' | 'CROP_UPDATE' | 'HARVEST' | 'LISTING_CREATE' | 'SENSOR_UPDATE';

export interface ActivityTrace {
  id: string;
  familyId: string;
  userId: string;
  userName: string;
  actionType: ActivityActionType;
  entityType: string;
  entityId: string;
  details?: Record<string, any> | null;
  timestamp: string;
}

// Association types
export type AssociationMemberStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Association {
  id: string;
  name: string;
  description?: string | null;
  rules?: string | null;
  creatorId: string;
  createdAt: string;
}

export interface AssociationMember {
  id: string;
  associationId: string;
  familyId: string;
  userId: string;
  status: AssociationMemberStatus;
  joinedAt?: string | null;
  rejectedAt?: string | null;
  rejectionReason?: string | null;
  requestedAt?: string;
  association?: Association;
}

