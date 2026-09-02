// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { UsersService } from './modules/users/users.service';

export async function createApp() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();
  app.setGlobalPrefix('api');

  const usersService = app.get(UsersService);
  await usersService.seedDefaultAdmin();

  // 🆕 Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('MpambolyMivoatry API')
    .setDescription(
      'API pour la plateforme agricole MpambolyMivoatry - Fambolena · Varotra · Fiaraha-miombona',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Entrez votre token JWT',
        in: 'header',
      },
      'JWT-auth', // clé de référence utilisée dans les décorateurs
    )
    .addTag('Auth', 'Inscription et connexion')
    .addTag('Users', 'Gestion des utilisateurs')
    .addTag('Parcels', 'Gestion des parcelles')
    .addTag('Crops', 'Gestion des cultures')
    .addTag('Harvests', 'Gestion des récoltes')
    .addTag('Inspections', 'Inspections des parcelles')
    .addTag('Marketplace - Shops', 'Gestion des boutiques')
    .addTag('Marketplace - Products', 'Produits par boutique')
    .addTag('Marketplace - Catalog', 'Catalogue public des produits')
    .addTag('Marketplace - Orders', 'Commandes')
    .addTag('Marketplace - Payment', 'Paiement (simulé)')
    .addTag('Association', 'Groupements, coopératives, stock mutualisé')
    // src/main.ts
    .addTag('Delivery - Profile', 'Profil et disponibilité du livreur')
    .addTag('Delivery', 'Gestion des livraisons')
    .addTag('IoT - Devices', 'Enregistrement des capteurs')
    .addTag('IoT - Sensors', 'Réception des données capteurs')
    .addTag('IoT - Irrigation', 'Configuration et historique irrigation')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  return app;
  console.log(`🚀 Application démarrée sur http://localhost:3000`);
  console.log(`📚 Documentation Swagger sur http://localhost:3000/api/docs`);
}

async function bootstrap() {
  const app = await createApp();
  const port = Number(process.env.PORT) || 3500;
  await app.listen(port);
}

if (require.main === module) {
  bootstrap();
}
