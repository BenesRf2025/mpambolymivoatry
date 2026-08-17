# Documentation Swagger - MpambolyMivoatry API

## 📚 Vue d'ensemble

La documentation interactive Swagger/OpenAPI a été entièrement configurée pour l'API MpambolyMivoatry. Elle fournit une interface visuelle complète pour explorer, tester et comprendre tous les endpoints disponibles.

## 🚀 Accès à la documentation

Une fois l'application en cours d'exécution, accédez à la documentation Swagger :

```
http://localhost:3000/api/docs
```

## 📋 Points de terminaison documentés

### **Auth** 🔐

- `POST /auth/register` - Inscription d'un nouvel utilisateur
- `POST /auth/login` - Connexion utilisateur avec numéro de téléphone

### **Users** 👤

- `GET /users/me` - Récupérer le profil de l'utilisateur connecté

### **Parcels** 🌾

- `POST /parcels` - Créer une nouvelle parcelle
- `GET /parcels` - Lister mes parcelles
- `GET /parcels/:id` - Détail d'une parcelle avec ses cultures

### **Crops** 🌱

- `POST /crops` - Créer une nouvelle culture
- `GET /crops` - Lister les cultures d'une parcelle
- `GET /crops/:id` - Détail d'une culture

### **Inspections** 🔍

- `POST /inspections` - Créer une nouvelle inspection
- `PATCH /inspections/:id/complete` - Compléter une inspection
- `GET /inspections/parcel/:parcelId` - Lister les inspections d'une parcelle
- `GET /inspections/advice` - Obtenir des conseils IA

### **Harvests** 🎯

- `POST /harvests` - Enregistrer une nouvelle récolte
- `GET /harvests/available` - Lister les récoltes disponibles

## 🔒 Authentification

La plupart des endpoints nécessitent une authentification JWT :

1. **Inscription** : Appelez `POST /auth/register` avec vos données
2. **Connexion** : Appelez `POST /auth/login` avec votre numéro de téléphone et mot de passe
3. **Token JWT** : Vous recevrez un token à utiliser dans les requêtes suivantes
4. **Autorisation** : Dans Swagger, cliquez sur le bouton "Authorize" et collez votre token

## 📝 Documentation des champs

Chaque DTO (Data Transfer Object) est documenté avec :

- Description du champ
- Type de données (string, number, date, etc.)
- Champs obligatoires vs optionnels
- Exemples de valeurs

### Exemples de champs documentés :

**CreateCropDto :**

- `parcelId` - ID de la parcelle
- `name` - Nom de la culture
- `variety` - Variété (optionnel)
- `plantingDate` - Date de plantation au format ISO 8601
- `expectedHarvestDate` - Date prévue de récolte (optionnel)
- `estimatedYieldKg` - Rendement estimé en kg (optionnel)

**CreateHarvestDto :**

- `cropId` - ID de la culture
- `harvestedAt` - Date de la récolte
- `quantityKg` - Quantité récoltée en kg
- `qualityGrade` - Note de qualité A, B, C (optionnel)

## 🔌 Configuration Swagger

La configuration se trouve dans [`src/main.ts`](./src/main.ts) :

```typescript
const config = new DocumentBuilder()
  .setTitle('MpambolyMivoatry API')
  .setDescription('API pour la plateforme agricole MpambolyMivoatry')
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
    'JWT-auth',
  )
  .addTag('Auth', 'Inscription et connexion')
  .addTag('Users', 'Gestion des utilisateurs')
  .addTag('Parcels', 'Gestion des parcelles')
  .addTag('Crops', 'Gestion des cultures')
  .addTag('Harvests', 'Gestion des récoltes')
  .addTag('Inspections', 'Inspections des parcelles')
  .build();
```

## 🎯 Décorateurs Swagger utilisés

### Sur les contrôleurs :

- `@ApiTags()` - Catégorise les endpoints
- `@ApiBearerAuth()` - Indique que l'authentification JWT est requise
- `@ApiOperation()` - Décrit l'action de l'endpoint
- `@ApiResponse()` - Document les codes HTTP de réponse
- `@ApiParam()` - Document les paramètres de route
- `@ApiQuery()` - Document les paramètres de requête

### Sur les DTOs :

- `@ApiProperty()` - Document une propriété obligatoire
- `@ApiPropertyOptional()` - Document une propriété optionnelle

## 💡 Conseils d'utilisation

1. **Testez les endpoints** - Swagger permet de tester directement depuis la UI
2. **Consultez les schémas** - Chaque réponse d'erreur est documentée
3. **Authentifiez-vous** - Utilisez le bouton "Authorize" pour les endpoints sécurisés
4. **Inspectez les codes** - Voir les codes HTTP possibles (200, 201, 400, 401, 404, etc.)

## 📦 Dépendances

La documentation Swagger utilise :

- `@nestjs/swagger` - Décorateurs et génération d'OpenAPI
- `swagger-ui-express` - Interface interactive (incluse dans @nestjs/swagger)

## 🔄 Mise à jour de la documentation

Chaque fois que vous :

- Ajoutez un nouvel endpoint
- Modifiez une DTO
- Changez un type de réponse

La documentation Swagger se met à jour automatiquement au redémarrage de l'application.

## ✅ Checklist pour bien documenter un nouvel endpoint

Lors de l'ajout d'un nouvel endpoint, vérifiez :

- [ ] Classe du contrôleur : `@ApiTags('YourTag')`
- [ ] Méthode : `@ApiOperation({ summary: '...' })`
- [ ] Réponses : `@ApiResponse({ status: 200, ... })`
- [ ] Paramètres : `@ApiParam()`, `@ApiQuery()`
- [ ] DTOs : `@ApiProperty()` et `@ApiPropertyOptional()`
- [ ] Authentification : `@ApiBearerAuth()` si nécessaire

---

**Note** : La documentation Swagger est auto-générée. Toute modification dans le code se reflète automatiquement après un redémarrage du serveur.
