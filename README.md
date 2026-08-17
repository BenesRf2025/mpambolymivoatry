API REST pour la plateforme agricole **MpambolyMivoatry** — _Fambolena · Varotra · Fiaraha-miombona_

Projet réalisé pour **Tech'Ntsaha 2026**.

---

## 📋 Stack Technique

- **Framework** : NestJS (TypeScript)
- **Base de données** : PostgreSQL + PostGIS
- **ORM** : TypeORM
- **Authentification** : JWT (Passport)
- **Documentation API** : Swagger
- **Conteneurisation** : Docker / Docker Compose

---

## ✅ Prérequis

Avant de commencer, installez sur votre machine :

| Outil          | Lien                                           |
| -------------- | ---------------------------------------------- |
| Node.js (v18+) | https://nodejs.org                             |
| Docker Desktop | https://www.docker.com/products/docker-desktop |
| Git            | https://git-scm.com                            |

⚠️ **Docker Desktop doit être ouvert et lancé** avant de démarrer le projet (icône baleine 🐳 stable dans la barre des tâches).

---

## 🚀 Installation (Étape par Étape)

# 1. Cloner le repo

```bash
git clone https://github.com/BenesRf2025/mpambolymivoatry.git
cd mpamboly-backend
git checkout feature/backend

# 2. Installer les dépendances

npm install

# 3. Générer automatiquement le .env (secret unique généré pour vous)

npm run setup

# 4. Lancer la base de données (Docker doit être ouvert)

docker-compose up -d

# 5. Lancer le serveur

npm run start:dev
\`\`\`

L'API tourne sur : http://localhost:3000
Documentation Swagger : http://localhost:3000/api/docs

**Aucune configuration manuelle nécessaire** — tout est généré automatiquement à l'étape 3.
```
