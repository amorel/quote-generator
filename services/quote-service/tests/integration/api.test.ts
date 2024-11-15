import { build } from "../../src/app";
import { FastifyInstance } from "fastify";
import { Container } from "../../src/container";
import { IQuoteRepository } from "../../src/domain/repositories/IQuoteRepository";
import { Quote } from "../../src/domain/entities/Quote";
import QuoteContent from "../../src/domain/value-objects/QuoteContent";
import { QuoteController } from "../../src/interface/api/controllers/QuoteController";
import { GetRandomQuotesUseCase } from "../../src/application/use-cases/quotes/GetRandomQuotes";
import { GetQuoteByIdUseCase } from "../../src/application/use-cases/quotes/GetQuoteById";
import { QuotePresenter } from "../../src/interface/api/presenters/QuotePresenter";
import { RabbitMQBase } from "@quote-generator/shared";
import { ToggleQuoteFavoriteUseCase } from "@/application/use-cases/quotes/ToggleQuoteFavorite";
import { TagController } from "../../src/interface/api/controllers/TagController";
import { AuthorController } from "../../src/interface/api/controllers/AuthorController";
import { Tag } from "../../src/domain/entities/Tag";
import { Author } from "../../src/domain/entities/Author";
import TagName from "../../src/domain/value-objects/TagName";
import AuthorName from "../../src/domain/value-objects/AuthorName";
import { ITagRepository } from "../../src/domain/repositories/ITagRepository";
import { IAuthorRepository } from "../../src/domain/repositories/IAuthorRepository";
import { TagPresenter } from "../../src/interface/api/presenters/TagPresenter";
import { AuthorPresenter } from "../../src/interface/api/presenters/AuthorPresenter";
import { GetAllTagsUseCase } from "../../src/application/use-cases/tags/GetAllTags";
import { GetTagByIdUseCase } from "../../src/application/use-cases/tags/GetTagById";
import { GetAllAuthorsUseCase } from "../../src/application/use-cases/authors/GetAllAuthors";
import { GetAuthorByIdUseCase } from "../../src/application/use-cases/authors/GetAuthorById";

interface MockServices {
  quoteRepository: IQuoteRepository;
  tagRepository: ITagRepository;
  authorRepository: IAuthorRepository;
  jwtService: any;
  quoteController: QuoteController;
  tagController: TagController;
  authorController: AuthorController;
  [key: string]: any;
}

interface MockTag {
  _id: string;
  name: string;
}

interface MockAuthor {
  _id: string;
  name: string;
  bio: string;
  description: string;
  link: string;
}

// Mock data
const mockQuotes = [
  {
    _id: "WQbJJwEFP1l9",
    content: "In the depth of winter...",
    author: "Albert Camus",
    tags: ["Famous Quotes", "Inspirational"],
  },
];

const mockTags: MockTag[] = [
  {
    _id: "tag1",
    name: "Famous Quotes",
  },
];

const mockAuthors: MockAuthor[] = [
  {
    _id: "author1",
    name: "Albert Camus",
    bio: "French philosopher",
    description: "Famous author",
    link: "https://example.com",
  },
];

class MockJWTService {
  verifyToken() {
    return {
      id: "test-user-id",
      email: "test@example.com",
      role: "user",
    };
  }
}

class MockQuoteRepository implements IQuoteRepository {
  async findRandom() {
    return mockQuotes.map(
      (q) => new Quote(q._id, QuoteContent.create(q.content), q.author, q.tags)
    );
  }

  async findById(id: string): Promise<Quote | null> {
    const quote = mockQuotes.find((q) => q._id === id);
    if (!quote) return null;

    return new Quote(
      quote._id,
      QuoteContent.create(quote.content),
      quote.author,
      quote.tags
    );
  }
}

class MockTagRepository implements ITagRepository {
  async findAll(): Promise<Tag[]> {
    return mockTags.map((t) => new Tag(t._id, TagName.create(t.name)));
  }

  async findById(id: string): Promise<Tag | null> {
    const tag = mockTags.find((t) => t._id === id);
    if (!tag) return null;
    return new Tag(tag._id, TagName.create(tag.name));
  }
}

class MockAuthorRepository implements IAuthorRepository {
  async findById(id: string): Promise<Author | null> {
    const author = mockAuthors.find((a) => a._id === id);
    if (!author) return null;
    return new Author(
      author._id,
      AuthorName.create(author.name),
      author.link,
      author.bio,
      author.description
    );
  }

  async findAll(): Promise<Author[]> {
    return mockAuthors.map(
      (a) =>
        new Author(
          a._id,
          AuthorName.create(a.name),
          a.link,
          a.bio,
          a.description
        )
    );
  }
}

describe("API Integration Tests", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    try {
      const mockQuoteRepository = new MockQuoteRepository();
      const mockTagRepository = new MockTagRepository();
      const mockAuthorRepository = new MockAuthorRepository();

      const quotePresenter = new QuotePresenter();
      const tagPresenter = new TagPresenter();
      const authorPresenter = new AuthorPresenter();

      const mockRabbitMQClient = {
        connect: jest.fn(),
        publish: jest.fn(),
        subscribe: jest.fn(),
        close: jest.fn(),
      } as unknown as RabbitMQBase;

      const toggleQuoteFavoriteUseCase = new ToggleQuoteFavoriteUseCase(
        mockRabbitMQClient
      );

      const mockServices: MockServices = {
        quoteRepository: mockQuoteRepository,
        tagRepository: mockTagRepository,
        authorRepository: mockAuthorRepository,
        jwtService: new MockJWTService(),
        quoteController: new QuoteController(
          new GetRandomQuotesUseCase(mockQuoteRepository, quotePresenter),
          new GetQuoteByIdUseCase(mockQuoteRepository, quotePresenter),
          toggleQuoteFavoriteUseCase
        ),
        tagController: new TagController(
          new GetAllTagsUseCase(mockTagRepository, tagPresenter),
          new GetTagByIdUseCase(mockTagRepository, tagPresenter)
        ),
        authorController: new AuthorController(
          new GetAllAuthorsUseCase(mockAuthorRepository, authorPresenter),
          new GetAuthorByIdUseCase(mockAuthorRepository, authorPresenter)
        ),
      };

      jest.spyOn(Container, "getInstance").mockImplementation(
        async () =>
          ({
            get: (key: string) => {
              if (key in mockServices) {
                return mockServices[key];
              }
              throw new Error(`Service ${key} not found in mock container`);
            },
          } as Container)
      );

      app = await build();
    } catch (error) {
      console.error("Failed to build app:", error);
      throw error;
    }
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
    jest.restoreAllMocks();
  });

  describe("GET /quotes/random", () => {
    it("should filter quotes by maxLength", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/quotes/random?maxLength=100",
      });

      expect(response.statusCode).toBe(200);
      const payload = JSON.parse(response.payload);
      expect(Array.isArray(payload)).toBe(true);
      if (payload.length > 0) {
        expect(payload[0].content.length).toBeLessThanOrEqual(100);
      }
    });

    it("should filter quotes by tags", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/quotes/random?tags=Famous Quotes",
      });

      expect(response.statusCode).toBe(200);
      const payload = JSON.parse(response.payload);
      expect(Array.isArray(payload)).toBe(true);
      if (payload.length > 0) {
        expect(payload[0].tags).toContain("Famous Quotes");
      }
    });
  });

  describe("GET /quotes/:id", () => {
    it("should return a specific quote", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/quotes/WQbJJwEFP1l9",
      });

      expect(response.statusCode).toBe(200);
      const payload = JSON.parse(response.payload);
      expect(payload._id).toBe("WQbJJwEFP1l9");
    });
  });

  describe("GET /tags", () => {
    it("should return all tags", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/tags",
      });

      expect(response.statusCode).toBe(200);
      const payload = JSON.parse(response.payload);
      expect(Array.isArray(payload)).toBe(true);
      expect(payload).toHaveLength(mockTags.length);
    });
  });

  describe("GET /tags/:id", () => {
    it("should return a specific tag", async () => {
      console.log("Testing GET /tags/tag1");
      const response = await app.inject({
        method: "GET",
        url: "/tags/tag1",
      });

      expect(response.statusCode).toBe(200);
      const payload = JSON.parse(response.payload);
      console.log("Tag payload:", payload);
      expect(payload).toMatchObject({
        id: "tag1",
        name: "Famous Quotes",
      });
    });
  });

  describe("GET /authors", () => {
    it("should return all authors", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/authors",
      });

      expect(response.statusCode).toBe(200);
      const payload = JSON.parse(response.payload);
      expect(Array.isArray(payload)).toBe(true);
      expect(payload).toHaveLength(mockAuthors.length);
    });
  });

  describe("GET /authors/:id", () => {
    it("should return a specific author", async () => {
      console.log("Testing GET /authors/author1");
      const response = await app.inject({
        method: "GET",
        url: "/authors/author1",
      });

      expect(response.statusCode).toBe(200);
      const payload = JSON.parse(response.payload);
      console.log("Author payload:", payload);
      expect(payload).toMatchObject({
        id: "author1",
        name: "Albert Camus",
        bio: "French philosopher",
        description: "Famous author",
        link: "https://example.com",
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid quote id", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/quotes/invalid-id",
      });

      expect(response.statusCode).toBe(404);
      const payload = JSON.parse(response.payload);
      expect(payload).toHaveProperty("status", "error");
    });

    it("should handle invalid limit parameter", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/quotes/random?limit=invalid",
      });

      expect(response.statusCode).toBe(400);
      const payload = JSON.parse(response.payload);
      expect(payload).toHaveProperty("status", "error");
    });

    it("should handle invalid tag id", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/tags/invalid-id",
      });

      expect(response.statusCode).toBe(404);
      const payload = JSON.parse(response.payload);
      expect(payload).toHaveProperty("status", "error");
    });

    it("should handle invalid author id", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/authors/invalid-id",
      });

      expect(response.statusCode).toBe(404);
      const payload = JSON.parse(response.payload);
      expect(payload).toHaveProperty("status", "error");
    });
  });
});
