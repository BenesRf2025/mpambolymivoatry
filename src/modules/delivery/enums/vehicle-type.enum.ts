// src/modules/delivery/enums/vehicle-type.enum.ts
export enum VehicleType {
  PIED = 'PIED',
  VELO = 'VELO',
  MOTO = 'MOTO',
  CAMIONNETTE = 'CAMIONNETTE',
}

// Rayon d'action par défaut selon véhicule (en km)
export const DEFAULT_RADIUS_BY_VEHICLE: Record<VehicleType, number> = {
  [VehicleType.PIED]: 3,
  [VehicleType.VELO]: 7,
  [VehicleType.MOTO]: 15,
  [VehicleType.CAMIONNETTE]: 30,
};
