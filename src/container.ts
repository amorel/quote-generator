import { QuoteRepository } from './repositories/quote.repository';
import { QuoteService } from './services/quote.service';

export class Container {
  private static instance: Container;
  private services: Map<string, any> = new Map();

  private constructor() {
    // Repositories
    const quoteRepository = new QuoteRepository();

    // Services
    const quoteService = new QuoteService(quoteRepository);

    // Register services
    this.services.set('quoteService', quoteService);
  }

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  get<T>(serviceName: string): T {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }
    return service;
  }
}