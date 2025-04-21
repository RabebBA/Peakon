import { Service } from 'typedi';
import { RouteModel } from '@/models/route.model';
import { Application } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '@/config';
import { IRoute } from '@/interfaces/route.interface';
import { HttpException } from '@/exceptions/httpException';

@Service()
export class RouteService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    if (!GEMINI_API_KEY) {
      throw new Error('❌ API key for Gemini AI is missing');
    }
    this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  private async generateTitlesAndDescriptions(endpoints: string[]): Promise<{ title: string; description: string }[]> {
    const inputMessage = `
      Génère des titres et descriptions pour les routes suivantes. 
      Chaque route est préfixée par un nombre, et la réponse doit suivre le format suivant :
      "1. Titre|||Description\n2. Titre|||Description\n..."
      
      Routes :
      ${endpoints.map((endpoint, index) => `${index + 1}. ${endpoint}`).join('\n')}
    `;

    try {
      const result = await this.model.startChat({ history: [] }).sendMessage(inputMessage);
      const responseText = result?.response?.text()?.trim() || '';

      return responseText.split('\n').map(line => {
        const parts = line.split('|||');
        return { title: parts[0]?.replace(/\d+\. /, '').trim(), description: parts[1]?.trim() || 'Description non disponible' };
      });
    } catch (error) {
      console.error('❌ Erreur lors de la génération des titres et descriptions:', error);
      return endpoints.map(endpoint => ({ title: endpoint, description: 'Description non disponible' }));
    }
  }

  public async syncRoutes(app: Application): Promise<void> {
    console.log('🔄 Synchronisation des routes...');

    const existingRoutes = await RouteModel.find({}, { endPoint: 1, _id: 0 });
    const existingPaths = new Set(existingRoutes.map(route => route.endPoint));

    const newRoutes: string[] = [];

    app._router.stack.forEach((middleware: any) => {
      if (middleware.route) {
        const path = middleware.route.path;
        const methods = Object.keys(middleware.route.methods);

        // On parcourt les méthodes et on les ajoute sous le format "methode+path"
        methods.forEach(method => {
          const endpoint = `${method.toUpperCase()} ${path}`;
          if (!existingPaths.has(endpoint)) {
            newRoutes.push(endpoint);
          }
        });
      } else if (middleware.name === 'router' && middleware.handle.stack) {
        const basePath = middleware.path || '';
        middleware.handle.stack.forEach((subMiddleware: any) => {
          if (subMiddleware.route) {
            const fullPath = `${basePath}${subMiddleware.route.path}`;
            const methods = Object.keys(subMiddleware.route.methods);

            // Ajouter la combinaison méthode + chemin
            methods.forEach(method => {
              const endpoint = `${method.toUpperCase()} ${fullPath}`;
              if (!existingPaths.has(endpoint)) {
                newRoutes.push(endpoint);
              }
            });
          }
        });
      }
    });

    if (newRoutes.length === 0) {
      console.log('✅ Aucune nouvelle route à ajouter.');
      return;
    }

    console.log(`📌 ${newRoutes.length} nouvelles routes détectées.`);
    const titlesAndDescriptions = await this.generateTitlesAndDescriptions(newRoutes);

    const routesToInsert = newRoutes.map((route, index) => ({
      endPoint: route,
      title: titlesAndDescriptions[index].title,
      description: titlesAndDescriptions[index].description,
    }));

    for (const route of routesToInsert) {
      await RouteModel.updateOne(
        { endPoint: route.endPoint },
        { $set: route },
        { upsert: true }, // Insère ou met à jour sans dupliquer
      );
    }

    console.log(`✅ ${routesToInsert.length} nouvelles routes ajoutées.`);
  }

  public async findAllRoutes(): Promise<IRoute[]> {
    const routes: IRoute[] = await RouteModel.find();
    return routes;
  }

  async findRouteById(routeId: string): Promise<IRoute | null> {
    const findRoute: IRoute = await RouteModel.findOne({ _id: routeId });
    if (!findRoute) throw new HttpException(409, "Route doesn't exist");

    return findRoute;
  }
}
