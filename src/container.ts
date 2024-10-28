import { AuthorRepository } from "./repositories/author.repository";
import { TagRepository } from "./repositories/tag.repository";
import { AuthorService } from "./services/author.service";
import { TagService } from "./services/tag.service";
import { LegacyQuoteRepository  as OldQuoteRepository } from "./repositories/LegacyQuoteRepository";
import { QuoteService } from "./services/quote.service";
import { QuoteRepository } from "./infrastructure/repositories/QuoteRepository";
import { GetRandomQuotesUseCase } from "./application/use-cases/quotes/GetRandomQuotes";
import { QuotePresenter } from "./interface/api/presenters/QuotePresenter";
import { QuoteController } from "./interface/api/controllers/QuoteController";
import { IQuoteRepository } from "./domain/repositories/IQuoteRepository";

export class Container {
  private static instance: Container;
  private services: Map<string, any> = new Map();
  private useCases: Map<string, any> = new Map();
  private presenters: Map<string, any> = new Map();
  private controllers: Map<string, any> = new Map();

  private constructor() {
    this.initializeLegacyServices();
    this.initializeQuoteServices();
  }

  private initializeLegacyServices() {
    const tagRepository = new TagRepository();
    const authorRepository = new AuthorRepository();
    
    const oldQuoteRepository = new OldQuoteRepository();
    const quoteService = new QuoteService(oldQuoteRepository);

    const tagService = new TagService(tagRepository);
    const authorService = new AuthorService(authorRepository);

    this.services.set("quoteService", quoteService);
    this.services.set("tagService", tagService);
    this.services.set("authorService", authorService);
  }

  private initializeQuoteServices() {
    const quoteRepository = new QuoteRepository();
    const quotePresenter = new QuotePresenter();
    
    this.services.set("quoteRepository", quoteRepository);
    this.presenters.set("quotePresenter", quotePresenter);

    const getRandomQuotesUseCase = new GetRandomQuotesUseCase(
      quoteRepository,
      quotePresenter
    );
    this.useCases.set("getRandomQuotesUseCase", getRandomQuotesUseCase);

    const quoteController = new QuoteController(getRandomQuotesUseCase);
    this.controllers.set("quoteController", quoteController);
  }

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  get<T>(serviceName: string): T {
    const service = this.services.get(serviceName);
    if (service) return service as T;

    const useCase = this.useCases.get(serviceName);
    if (useCase) return useCase as T;

    const presenter = this.presenters.get(serviceName);
    if (presenter) return presenter as T;

    const controller = this.controllers.get(serviceName);
    if (controller) return controller as T;

    throw new Error(`Service ${serviceName} not found`);
  }

  getUseCase<T>(name: string): T {
    const useCase = this.useCases.get(name);
    if (!useCase) {
      throw new Error(`Use case ${name} not found`);
    }
    return useCase as T;
  }

  getPresenter<T>(name: string): T {
    const presenter = this.presenters.get(name);
    if (!presenter) {
      throw new Error(`Presenter ${name} not found`);
    }
    return presenter as T;
  }

  getController<T>(name: string): T {
    const controller = this.controllers.get(name);
    if (!controller) {
      throw new Error(`Controller ${name} not found`);
    }
    return controller as T;
  }
}