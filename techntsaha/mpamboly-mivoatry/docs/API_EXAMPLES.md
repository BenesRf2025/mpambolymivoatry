# API Examples for Mpamboly (requests & responses)

## Login

Request POST /api/auth/login

{
  "phone": "+261330000000",
  "password": "secret"
}

Response 200

{
  "token": "eyJhb...",
  "user": {
    "id": "user-uuid-1",
    "name": "Rabe",
    "phone": "+261330000000",
    "roles": ["farmer"]
  }
}

---

## Get sensors (GET /api/sensors)

Response 200

[
  {
    "id": "sensor-1",
    "name": "Parcelle A - Node 1",
    "status": "online",
    "lastSeen": "2026-08-13T08:45:00Z",
    "soilMoisture": 23.4,
    "battery": 87,
    "location": { "lat": -18.879, "lon": 47.507 }
  }
]

---

## Post telemetry (POST /api/sensors/{id}/telemetry)

Request

{
  "soilMoisture": 24.1,
  "battery": 85,
  "timestamp": "2026-08-13T08:50:00Z"
}

Response 200

{
  "id": "telemetry-uuid-1",
  "receivedAt": "2026-08-13T08:50:01Z"
}

---

## Create listing (POST /api/listings)

Request

{
  "sellerId": "user-uuid-1",
  "sellerType": "producteur",
  "name": "Riz local - qualité A",
  "description": "Riz récolté en août",
  "unit": "kg",
  "quantity": 500,
  "price": 800,
  "images": ["https://.../img1.jpg"]
}

Response 201

{
  "id": "listing-uuid-1",
  "sellerId": "user-uuid-1",
  "sellerType": "producteur",
  "name": "Riz local - qualité A",
  "description": "Riz récolté en août",
  "unit": "kg",
  "quantity": 500,
  "price": 800,
  "images": ["https://.../img1.jpg"],
  "createdAt": "2026-08-13T09:00:00Z"
}

---

## Create inspection (POST /api/inspections)

Request

{
  "farmerId": "user-uuid-1",
  "cropId": "crop-1",
  "photos": ["https://.../photo1.jpg"],
  "voiceNotes": ["https://.../voice1.mp3"],
  "notes": "Présence de ravageurs sur feuille nord",
  "location": { "lat": -18.879, "lon": 47.507 }
}

Response 201

{
  "id": "inspection-uuid-1",
  "farmerId": "user-uuid-1",
  "cropId": "crop-1",
  "createdAt": "2026-08-13T09:15:00Z"
}

---

## Sync batch (POST /api/sync/batch)

Request

{
  "actions": [
    { "type": "create_listing", "clientId": "c-1", "payload": { /* NewListing */ } },
    { "type": "create_inspection", "clientId": "c-2", "payload": { /* Inspection */ } }
  ]
}

Response 200

{
  "applied": ["c-1", "c-2"],
  "errors": []
}
