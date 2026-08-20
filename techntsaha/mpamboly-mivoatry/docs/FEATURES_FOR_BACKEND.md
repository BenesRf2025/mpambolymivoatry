# Mpamboly — Fonctionnalités (Guide rapide pour l'équipe backend)

Ce document décrit les fonctionnalités principales de l'application mobile Mpamboly, les modèles de données attendus et des endpoints API suggérés pour aider l'équipe backend à implémenter les services nécessaires.

## Objectif
Donner une vue d'ensemble rapide des modules front-end et des interactions attendues avec le backend (auth, données IoT, marché, inspections, coopérative, synchronisation hors-ligne).

---

## Modules principaux

- Auth & Utilisateurs
  - Login / logout, gestion de rôles (`UserRole`: ex. `farmer`, `seller`, `buyer`, `association_admin`).
  - Profil fermier (`FarmerProfile`): id, name, phone, associationName, profilePicture, settings.

- Gestion des rôles
  - `RoleSelector` : front peut changer rôle actif; backend fournit la liste de rôles et permissions.

- Smart Irrigation (IoT)
  - `IoTSensorNode` : id, name, status (`online|offline|unknown`), lastSeen (ISO), soilMoisture (number), battery, valveState, location.
  - Route d'envoi de télémétrie et route de récupération des nœuds et états.

- Inspection de champs
  - Enregistrements d'inspection: id, farmerId, cropId, photos (URLs), voiceNotes (URLs), notes, location, createdAt.

- Marché / Boutique (Listings)
  - `MarketItem` / Listing: id, sellerId, sellerType (`producteur`|`cooperative`), name, description, unit, quantity, price, images[], createdAt, status.
  - Orders / Transactions: id, listingId, buyerId, quantity, totalPrice, paymentMethod (e.g. `mvola`), status (pending/confirmed/shipped/delivered).

- Coopérative / Association
  - `CooperativeGroup` : id, name, collectiveStockTonnes, members[], contact.

- Cultures (Crops)
  - `Crop`: id, name, malagasyName, stage, daysToHarvest, progressPercent, icon, surfaceArea, healthScore.

- Market Prices Ticker
  - `CommodityPrice`: id, name, malagasyName, currentPrice, unit, trend (up|down|flat), variationPercent, updatedAt.

- Offline & Sync
  - Front maintient un queue de synchronisation. Backend doit exposer endpoints idempotents (POST/PUT) et retourner timestamps/IDs.
  - Endpoint de statut de sync (ex: /sync/status) pour afficher `OfflineIndicator` et état "syncing".

- Internationalisation
  - Textes FR/MG fournis côté front; backend peut donner libellés dynamiques si nécessaire.

---

## Endpoints API suggérés (exemples)

- Auth
  - POST /api/auth/login { phone, password } -> { token, user }
  - POST /api/auth/logout

- Farmer / Profile
  - GET /api/farmers/:id
  - PUT /api/farmers/:id

- Sensors / IoT
  - GET /api/sensors -> list of sensor nodes
  - GET /api/sensors/:id -> node details
  - POST /api/sensors/:id/telemetry -> { soilMoisture, battery, timestamp }
  - POST /api/sensors/batch -> [{id, soilMoisture, battery, timestamp}, ...]

- Inspections
  - POST /api/inspections -> { farmerId, cropId, photos: [url], voiceNotes: [url], notes }
  - GET /api/inspections?farmerId=...

- Listings & Market
  - GET /api/listings
  - POST /api/listings -> create listing
  - GET /api/listings/:id
  - POST /api/orders -> { listingId, buyerId, quantity, paymentMethod }
  - GET /api/orders?sellerId=...

- Commodity prices
  - GET /api/prices
  - POST /api/prices (admin)

- Cooperative
  - GET /api/cooperatives/:id
  - PUT /api/cooperatives/:id/stock -> { collectiveStockTonnes }

- Sync / Offline
  - POST /api/sync/batch -> apply queued actions, return resolved IDs and timestamps
  - GET /api/sync/status -> { lastSyncedAt, pending: number }

- Webhook / Notifications
  - POST /api/webhooks/order-updated

---

## Formats & bonnes pratiques

- Dates en ISO 8601 UTC (ex: 2026-08-13T12:00:00Z).
- IDs: UUIDv4 ou string stable renvoyé par backend.
- Endpoints idempotents pour la synchronisation hors-ligne (ex: utiliser client-generated IDs et retourner `conflict` ou `merged`).
- Valider les images/voices via URLs pré-signées (S3/GCS) pour uploads côté mobile.
- Protéger les endpoints sensibles avec JWT + RBAC.
- Pagination pour listes (prices, listings, sensors) : `?limit=&offset=` ou cursors.

---

## Observations front -> backend

- Le front attend des champs `sensorNodes[].status` pour compter les capteurs en ligne.
- Le front affiche `sensorNodes[0]?.soilMoisture` dans la home — donc garantir ordre ou fournir endpoint résumé `GET /api/sensors/summary`.
- Le front envoie parfois des opérations hors-ligne (création de listing, inspection) — backend doit renvoyer identifiants utilisables localement.

---

## Contact & suivis
Pour précisions (noms exacts des champs, contraintes, ou mock responses), je peux produire un petit OpenAPI (YAML/JSON) couvrant les endpoints ci-dessus.

---

Fichier généré automatiquement par l'équipe frontend — indiquez si vous voulez un OpenAPI ou des exemples de payloads JSON pour chaque endpoint.
