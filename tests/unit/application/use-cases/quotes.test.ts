import { GetRandomQuotesUseCase } from "../../../../src/application/use-cases/quotes/GetRandomQuotes";
import { QuoteRepository } from "../../../../src/infrastructure/repositories/QuoteRepository";
import { QuotePresenter } from "../../../../src/interface/api/presenters/QuotePresenter";
import { QuoteFiltersVO } from "../../../../src/domain/value-objects/QuoteFilters";
import { Quote } from "../../../../src/domain/entities/Quote";
import QuoteContent from "../../../../src/domain/value-objects/QuoteContent";

jest.mock("../../../../src/infrastructure/repositories/QuoteRepository");
jest.mock("../../../../src/interface/api/presenters/QuotePresenter");

describe("GetRandomQuotesUseCase", () => {
  let useCase: GetRandomQuotesUseCase;
  let mockRepository: jest.Mocked<QuoteRepository>;
  let mockPresenter: jest.Mocked<QuotePresenter>;

  beforeEach(() => {
    mockRepository = new QuoteRepository() as jest.Mocked<QuoteRepository>;
    mockPresenter = new QuotePresenter() as jest.Mocked<QuotePresenter>;
    useCase = new GetRandomQuotesUseCase(mockRepository, mockPresenter);
  });

  it("should return random quotes based on filters", async () => {
    const filters = QuoteFiltersVO.create({ limit: 2 });

    // Créer de vraies instances de Quote
    const mockQuotes = [
      new Quote("1", QuoteContent.create("Quote 1"), "author-1", ["tag1"]),
      new Quote("2", QuoteContent.create("Quote 2"), "author-2", ["tag2"]),
    ];

    // Mock des DTOs retournés par le presenter
    const mockDTOs = [
      { id: "1", content: "Quote 1", authorName: "Author 1", tags: ["tag1"] },
      { id: "2", content: "Quote 2", authorName: "Author 2", tags: ["tag2"] },
    ];

    mockRepository.findRandom.mockResolvedValue(mockQuotes);
    mockPresenter.toDTO
      .mockReturnValueOnce(mockDTOs[0])
      .mockReturnValueOnce(mockDTOs[1]);

    const result = await useCase.execute(filters);

    expect(result).toHaveLength(2);
    expect(mockRepository.findRandom).toHaveBeenCalledWith(filters);
    expect(mockPresenter.toDTO).toHaveBeenCalledTimes(2);
    expect(result).toEqual(mockDTOs);
  });
});

import { GetQuoteByIdUseCase } from "../../../../src/application/use-cases/quotes/GetQuoteById";
import { NotFoundError } from "../../../../src/errors";

describe("GetQuoteByIdUseCase", () => {
  let useCase: GetQuoteByIdUseCase;
  let mockRepository: jest.Mocked<QuoteRepository>;
  let mockPresenter: jest.Mocked<QuotePresenter>;

  beforeEach(() => {
    mockRepository = new QuoteRepository() as jest.Mocked<QuoteRepository>;
    mockPresenter = new QuotePresenter() as jest.Mocked<QuotePresenter>;
    useCase = new GetQuoteByIdUseCase(mockRepository, mockPresenter);
  });

  it("should return quote by id", async () => {
    const mockQuote = new Quote(
      "test-id",
      QuoteContent.create("Test quote"),
      "author-id",
      ["tag1"]
    );

    const mockDTO = {
      id: "test-id",
      content: "Test quote",
      authorName: "Author Name",
      tags: ["tag1"],
    };

    mockRepository.findById.mockResolvedValue(mockQuote);
    mockPresenter.toDTO.mockReturnValue(mockDTO);

    const result = await useCase.execute("test-id");

    expect(result).toEqual(mockDTO);
    expect(mockRepository.findById).toHaveBeenCalledWith("test-id");
    expect(mockPresenter.toDTO).toHaveBeenCalledWith(mockQuote);
  });

  it("should throw NotFoundError when quote does not exist", async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute("non-existent-id")).rejects.toThrow(
      NotFoundError
    );
  });
});
