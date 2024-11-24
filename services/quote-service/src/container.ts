import { QuoteRepository } from "./infrastructure/repositories/QuoteRepository";
import { GetRandomQuotesUseCase } from "./application/use-cases/quotes/GetRandomQuotes";
import { QuotePresenter } from "./interface/api/presenters/QuotePresenter";
import { QuoteController } from "./interface/api/controllers/QuoteController";

// Import des composants Author
import { AuthorRepository } from "./infrastructure/repositories/AuthorRepository";
import { GetAllAuthorsUseCase } from "./application/use-cases/authors/GetAllAuthors";
import { GetAuthorByIdUseCase } from "./application/use-cases/authors/GetAuthorById";
import { AuthorPresenter } from "./interface/api/presenters/AuthorPresenter";
import { AuthorController } from "./interface/api/controllers/AuthorController";

// Import des composants Tag
import { TagRepository } from "./infrastructure/repositories/TagRepository";
import { GetAllTagsUseCase } from "./application/use-cases/tags/GetAllTags";
import { GetTagByIdUseCase } from "./application/use-cases/tags/GetTagById";
import { TagPresenter } from "./interface/api/presenters/TagPresenter";
import { TagController } from "./interface/api/controllers/TagController";
import { GetQuoteByIdUseCase } from "./application/use-cases/quotes/GetQuoteById";
import { RabbitMQBase, RabbitMQConfig } from "@quote-generator/shared";
import { ToggleQuoteFavoriteUseCase } from "./application/use-cases/quotes/ToggleQuoteFavorite";

export class Container {
  private static instance: Container;
  private initialized: boolean = false;
  private services: Map<string, any> = new Map();
  private useCases: Map<string, any> = new Map();
  private presenters: Map<string, any> = new Map();
  private controllers: Map<string, any> = new Map();

  private constructor() {}

  private async initializeMessaging() {
    console.log(`RABBITMQ_URL: ${process.env.RABBITMQ_URL}`);

    const rabbitMQConfig: RabbitMQConfig = {
      url: process.env.RABBITMQ_URL || "amqp://admin:password@localhost:5672",
      serviceName: "quote-service",
      reconnectAttempts: 5,
      reconnectInterval: 5000,
      prefetch: 1,
    };

    const rabbitMQClient = new RabbitMQBase(rabbitMQConfig);

    // Attendre la connexion
    try {
      await rabbitMQClient.connect();
      this.services.set("rabbitMQClient", rabbitMQClient);
      console.log("✅ RabbitMQ connected successfully");
      this.services.set("rabbitMQClient", rabbitMQClient);
    } catch (error) {
      console.error("❌ Failed to connect to RabbitMQ:", error);
      // En développement, on peut continuer sans RabbitMQ
      if (process.env.NODE_ENV === "development") {
        console.warn("⚠️ Running without RabbitMQ in development mode");
      } else {
        throw error;
      }
    }
  }

  private initializeQuoteServices() {
    const quoteRepository = new QuoteRepository();
    const quotePresenter = new QuotePresenter();
    const rabbitMQClient = this.services.get("rabbitMQClient");

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

    const toggleQuoteFavoriteUseCase = new ToggleQuoteFavoriteUseCase(
      rabbitMQClient
    );

    this.useCases.set("getRandomQuotesUseCase", getRandomQuotesUseCase);
    this.useCases.set("getQuoteByIdUseCase", getQuoteByIdUseCase);
    this.useCases.set("toggleQuoteFavoriteUseCase", toggleQuoteFavoriteUseCase);

    const quoteController = new QuoteController(
      getRandomQuotesUseCase,
      getQuoteByIdUseCase,
      toggleQuoteFavoriteUseCase
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

  static async getInstance(): Promise<Container> {
    if (!Container.instance) {
      Container.instance = new Container();
      await Container.instance.initialize();
    } else if (!Container.instance.initialized) {
      await Container.instance.initialize();
    }
    return Container.instance;
  }

  private async initialize() {
    if (this.initialized) return;

    await this.initializeMessaging();
    this.initializeQuoteServices();
    this.initializeAuthorServices();
    this.initializeTagServices();

    this.initialized = true;
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
