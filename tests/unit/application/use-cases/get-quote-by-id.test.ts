import { GetQuoteByIdUseCase } from "../../../../src/application/use-cases/quotes/GetQuoteById";
import { QuoteRepository } from "../../../../src/infrastructure/repositories/QuoteRepository";
import { QuotePresenter } from "../../../../src/interface/api/presenters/QuotePresenter";
import { Quote } from "../../../../src/domain/entities/Quote";
import { NotFoundError } from "../../../../src/errors";
import QuoteContent from "../../../../src/domain/value-objects/QuoteContent";

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

  it("should successfully return a quote by id", async () => {
    // Arrange
    const mockQuote = new Quote(
      "test-id",
      QuoteContent.create("Test quote content"),
      "author-id",
      ["tag1", "tag2"]
    );

    const expectedDTO = {
      id: "test-id",
      content: "Test quote content",
      authorName: "Author Name",
      tags: ["tag1", "tag2"],
    };

    mockRepository.findById.mockResolvedValue(mockQuote);
    mockPresenter.toDTO.mockReturnValue(expectedDTO);

    // Act
    const result = await useCase.execute("test-id");

    // Assert
    expect(result).toEqual(expectedDTO);
    expect(mockRepository.findById).toHaveBeenCalledWith("test-id");
    expect(mockPresenter.toDTO).toHaveBeenCalledWith(mockQuote);
  });

  it("should throw NotFoundError when quote does not exist", async () => {
    // Arrange
    mockRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.execute("non-existent-id")).rejects.toThrow(
      NotFoundError
    );
    expect(mockRepository.findById).toHaveBeenCalledWith("non-existent-id");
    expect(mockPresenter.toDTO).not.toHaveBeenCalled();
  });

  it("should handle repository errors", async () => {
    // Arrange
    const error = new Error("Database error");
    mockRepository.findById.mockRejectedValue(error);

    // Act & Assert
    await expect(useCase.execute("test-id")).rejects.toThrow(error);
    expect(mockRepository.findById).toHaveBeenCalledWith("test-id");
    expect(mockPresenter.toDTO).not.toHaveBeenCalled();
  });

  it("should handle presenter errors", async () => {
    // Arrange
    const mockQuote = new Quote(
      "test-id",
      QuoteContent.create("Test quote content"),
      "author-id",
      ["tag1", "tag2"]
    );
    const error = new Error("Presenter error");

    mockRepository.findById.mockResolvedValue(mockQuote);
    mockPresenter.toDTO.mockImplementation(() => {
      throw error;
    });

    // Act & Assert
    await expect(useCase.execute("test-id")).rejects.toThrow(error);
    expect(mockRepository.findById).toHaveBeenCalledWith("test-id");
    expect(mockPresenter.toDTO).toHaveBeenCalledWith(mockQuote);
  });
});
