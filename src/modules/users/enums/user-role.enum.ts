// src/modules/users/enums/user-role.enum.ts
export enum UserRole {
  AGRICULTEUR = 'AGRICULTEUR',
  VENDEUR = 'VENDEUR',
  ACHETEUR = 'ACHETEUR',
  LIVREUR = 'LIVREUR',
  ASSOCIATION = 'ASSOCIATION',
  ADMINISTRATEUR = 'ADMINISTRATEUR',
}

// Rôles qu'un utilisateur peut choisir librement à l'inscription
export const SELF_ASSIGNABLE_ROLES = [
  UserRole.AGRICULTEUR,
  UserRole.VENDEUR,
  UserRole.ACHETEUR,
  UserRole.LIVREUR,
];
