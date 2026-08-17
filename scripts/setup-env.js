const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');

if (fs.existsSync(envPath)) {
  console.log('✅ Le fichier .env existe déjà. Rien à faire.');
  process.exit(0);
}

const jwtSecret = crypto.randomBytes(64).toString('hex');

const envContent = `NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=mpamboly
DB_PASSWORD=mpamboly_dev
DB_NAME=mpamboly_db

JWT_SECRET=${jwtSecret}
JWT_EXPIRES_IN=7d
`;

fs.writeFileSync(envPath, envContent);
console.log(
  '✅ Fichier .env généré automatiquement avec un JWT_SECRET unique.',
);
