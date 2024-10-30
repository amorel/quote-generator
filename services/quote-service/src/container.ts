// src/container.ts
import { QuoteRepository } from "./infrastructure/repositories/QuoteRepository";
import { GetRandomQuotesUseCase } from "./application/use-cases/quotes/GetRandomQuotes";
import { QuotePresenter } from "./interface/api/presenters/QuotePresenter";
import { QuoteController } from "./interface/api/controllers/QuoteController";
import { IQuoteRepository } from "./domain/repositories/IQuoteRepository";

// Import des composants Author
import { AuthorRepository } from "./infrastructure/repositories/AuthorRepository";
import { IAuthorRepository } from "./domain/repositories/IAuthorRepository";
import { GetAllAuthorsUseCase } from "./application/use-cases/authors/GetAllAuthors";
import { GetAuthorByIdUseCase } from "./application/use-cases/authors/GetAuthorById";
import { AuthorPresenter } from "./interface/api/presenters/AuthorPresenter";
import { AuthorController } from "./interface/api/controllers/AuthorController";

// Import des composants Tag
import { TagRepository } from "./infrastructure/repositories/TagRepository";
import { ITagRepository } from "./domain/repositories/ITagRepository";
import { GetAllTagsUseCase } from "./application/use-cases/tags/GetAllTags";
import { GetTagByIdUseCase } from "./application/use-cases/tags/GetTagById";
import { TagPresenter } from "./interface/api/presenters/TagPresenter";
import { TagController } from "./interface/api/controllers/TagController";
import { GetQuoteByIdUseCase } from "./application/use-cases/quotes/GetQuoteById";
import { JWTService } from "./services/JWTService";

export class Container {
  private static instance: Container;
  private services: Map<string, any> = new Map();
  private useCases: Map<string, any> = new Map();
  private presenters: Map<string, any> = new Map();
  private controllers: Map<string, any> = new Map();

  private constructor() {
    this.initializeQuoteServices();
    this.initializeAuthorServices();
    this.initializeTagServices();
    this.initializeServices();
  }

  private initializeServices() {
    const jwtService = new JWTService();
    this.services.set('jwtService', jwtService);
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
    const getQuoteByIdUseCase = new GetQuoteByIdUseCase(
      quoteRepository,
      quotePresenter
    );

    this.useCases.set("getRandomQuotesUseCase", getRandomQuotesUseCase);
    this.useCases.set("getQuoteByIdUseCase", getQuoteByIdUseCase);

    const quoteController = new QuoteController(
      getRandomQuotesUseCase,
      getQuoteByIdUseCase
    );
    this.controllers.set("quoteController", quoteController);
  }

  private initializeAuthorServices() {
    const authorRepository = new AuthorRepository();
    const authorPresenter = new AuthorPresenter();

    this.services.set("authorRepository", authorRepository);
    this.presenters.set("authorPresenter", authorPresenter);

    const getAllAuthorsUseCase = new GetAllAuthorsUseCase(
      authorRepository,
      authorPresenter
    );
    const getAuthorByIdUseCase = new GetAuthorByIdUseCase(
      authorRepository,
      authorPresenter
    );

    this.useCases.set("getAllAuthorsUseCase", getAllAuthorsUseCase);
    this.useCases.set("getAuthorByIdUseCase", getAuthorByIdUseCase);

    const authorController = new AuthorController(
      getAllAuthorsUseCase,
      getAuthorByIdUseCase
    );
    this.controllers.set("authorController", authorController);
  }

  private initializeTagServices() {
    const tagRepository = new TagRepository();
    const tagPresenter = new TagPresenter();

    this.services.set("tagRepository", tagRepository);
    this.presenters.set("tagPresenter", tagPresenter);

    const getAllTagsUseCase = new GetAllTagsUseCase(
      tagRepository,
      tagPresenter
    );
    const getTagByIdUseCase = new GetTagByIdUseCase(
      tagRepository,
      tagPresenter
    );

    this.useCases.set("getAllTagsUseCase", getAllTagsUseCase);
    this.useCases.set("getTagByIdUseCase", getTagByIdUseCase);

    const tagController = new TagController(
      getAllTagsUseCase,
      getTagByIdUseCase
    );
    this.controllers.set("tagController", tagController);
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

  // Méthode utilitaire pour tester
  clearInstance() {
    Container.instance = undefined as any;
  }
}
