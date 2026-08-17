## 🚀 Installation Rapide (Nouveau Développeur)

\`\`\`bash

# 1. Cloner le repo

git clone <url-du-repo>
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
