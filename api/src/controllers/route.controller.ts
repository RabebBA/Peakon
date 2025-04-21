import { Request, Response, NextFunction } from 'express';
import { RouteService } from '@/services/route.service';
import { Application } from 'express';
import { Container } from 'typedi';
import { IRoute } from '@/interfaces/route.interface';

export class RouteController {
  public route = Container.get(RouteService);

  public getAllRoutes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('📌 Avant appel de findAllRoutes', this.route);
      const findAllRoutesData: IRoute[] = await this.route.findAllRoutes();
      res.status(200).json({ data: findAllRoutesData, message: 'findAll' });
    } catch (error) {
      console.error('❌ Erreur dans getAllRoutes:', error);
      next(error);
    }
  };

  public syncRoutes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const app = req.app as Application;
      console.log('📡 Début de la synchronisation des routes...');
      await this.route.syncRoutes(app); // Utilisation correcte du service

      console.log('✅ Routes synchronisées avec succès !');
      return res.status(200).json({ message: 'Routes synchronisées avec succès' });
    } catch (error) {
      console.error('❌ Erreur lors de la synchronisation des routes:', error.message);
      return res.status(500).json({ message: 'Erreur interne du serveur', error: error.message });
    }
  };

  public getRouteById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const route = await this.route.findRouteById(id);
      if (!route) {
        return res.status(404).json({ message: 'Route non trouvée' });
      }
      return res.status(200).json(route);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de la route:', error);
      return res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };
}
