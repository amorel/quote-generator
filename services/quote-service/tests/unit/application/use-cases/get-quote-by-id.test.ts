import { GetQuoteByIdUseCase } from "../../../../src/application/use-cases/quotes/GetQuoteById";
import { QuoteRepository } from "../../../../src/infrastructure/repositories/QuoteRepository";
import { QuotePresenter } from "../../../../src/interface/api/presenters/QuotePresenter";
import { Quote } from "../../../../src/domain/entities/Quote";
import QuoteContent from "../../../../src/domain/value-objects/QuoteContent";
import { NotFoundError } from "../../../../src/interface/errors";
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

jest.mock("../../../../src/infrastructure/repositories/QuoteRepository");
jest.mock("../../../../src/interface/api/presenters/QuotePresenter");

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
