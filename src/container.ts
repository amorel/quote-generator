import { AuthorRepository } from "./repositories/author.repository";
import { QuoteRepository } from "./repositories/quote.repository";
import { TagRepository } from "./repositories/tag.repository";
import { AuthorService } from "./services/author.service";
import { QuoteService } from "./services/quote.service";
import { TagService } from "./services/tag.service";

export class Container {
  private static instance: Container;
  private services: Map<string, any> = new Map();

  private constructor() {
    // Repositories
    const quoteRepository = new QuoteRepository();
    const tagRepository = new TagRepository();
    const authorRepository = new AuthorRepository();

    // Services
    const quoteService = new QuoteService(quoteRepository);
    const tagService = new TagService(tagRepository);
    const authorService = new AuthorService(authorRepository);

    // Register services
    this.services.set("quoteService", quoteService);
    this.services.set("tagService", tagService);
    this.services.set("authorService", authorService);
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
