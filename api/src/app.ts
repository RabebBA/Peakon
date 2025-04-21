import 'reflect-metadata';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import mongoose from 'mongoose';
import http from 'http'; // ✅ Import http
import { Container } from 'typedi'; // ✅ Import typedi

import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS } from '@config';
import { dbConnection } from '@database';
import { Routes } from '@interfaces/routes.interface';
import { ErrorMiddleware } from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';
import { WsGateway } from '@services/wsGateway'; // ✅ Ton gateway socket

export class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public server: http.Server; // ✅ Serveur HTTP exposé (pour attach WebSocket)

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3001;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();

    this.server = http.createServer(this.app); // ✅ Création du serveur HTTP
    this.initializeWebSocket(); // ✅ Attache Socket.IO
  }

  public listen() {
    this.server.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  public getHttpServer() {
    return this.server; // ✅ Permet d'y accéder ailleurs si besoin
  }

  private async connectToDatabase() {
    await dbConnection();
    await this.fixRoleIndexes();
  }

  private async fixRoleIndexes() {
    try {
      const db = mongoose.connection.db;
      const indexes = await db.collection('roles').indexes();

      if (indexes.some(index => index.name === 'name_1')) {
        logger.warn('⚠️ Suppression de l’index name_1 erroné...');
        await db.collection('roles').dropIndex('name_1');
        logger.info('✅ Index name_1 supprimé avec succès.');
      } else {
        logger.info('✅ Aucun index name_1 à supprimer.');
      }
    } catch (error) {
      logger.error('❌ Erreur lors de la suppression de l’index name_1:', error);
    }
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
  }

  private initializeWebSocket() {
    const wsGateway = Container.get(WsGateway);
    wsGateway.init(this.server); // ✅ Initialise WebSocket avec le serveur HTTP
  }
}
