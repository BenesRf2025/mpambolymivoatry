// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();

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
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
  console.log(`🚀 Application démarrée sur http://localhost:3000`);
  console.log(`📚 Documentation Swagger sur http://localhost:3000/api/docs`);
}
bootstrap();
