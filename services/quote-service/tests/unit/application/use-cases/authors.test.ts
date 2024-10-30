import { GetAllAuthorsUseCase } from "../../../../src/application/use-cases/authors/GetAllAuthors";
import { GetAuthorByIdUseCase } from "../../../../src/application/use-cases/authors/GetAuthorById";
import { AuthorRepository } from "../../../../src/infrastructure/repositories/AuthorRepository";
import { AuthorPresenter } from "../../../../src/interface/api/presenters/AuthorPresenter";
import { Author } from "../../../../src/domain/entities/Author";
import AuthorName from "../../../../src/domain/value-objects/AuthorName";
import { NotFoundError } from "../../../../src/interface/errors";
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

jest.mock("../../../../src/infrastructure/repositories/AuthorRepository");
jest.mock("../../../../src/interface/api/presenters/AuthorPresenter");

describe("Author Use Cases", () => {
  let mockRepository: jest.Mocked<AuthorRepository>;
  let mockPresenter: jest.Mocked<AuthorPresenter>;

  beforeEach(() => {
    mockRepository = new AuthorRepository() as jest.Mocked<AuthorRepository>;
    mockPresenter = new AuthorPresenter() as jest.Mocked<AuthorPresenter>;
  });

  describe("GetAllAuthorsUseCase", () => {
    it("should return all authors", async () => {
      const mockAuthors = [
        new Author(
          "1",
          AuthorName.create("Author 1"),
          "http://example.com/1",
          "Bio 1",
          "Description 1"
        ),
        new Author(
          "2",
          AuthorName.create("Author 2"),
          "http://example.com/2",
          "Bio 2",
          "Description 2"
        ),
      ];

      const mockDTOs = [
        {
          id: "1",
          name: "Author 1",
          link: "http://example.com/1",
          bio: "Bio 1",
          description: "Description 1",
        },
        {
          id: "2",
          name: "Author 2",
          link: "http://example.com/2",
          bio: "Bio 2",
          description: "Description 2",
        },
      ];

      mockRepository.findAll.mockResolvedValue(mockAuthors);
      mockPresenter.toDTO
        .mockReturnValueOnce(mockDTOs[0])
        .mockReturnValueOnce(mockDTOs[1]);

      const useCase = new GetAllAuthorsUseCase(mockRepository, mockPresenter);
      const result = await useCase.execute();

      expect(result).toEqual(mockDTOs);
      expect(mockRepository.findAll).toHaveBeenCalled();
      expect(mockPresenter.toDTO).toHaveBeenCalledTimes(2);
    });
  });

  describe("GetAuthorByIdUseCase", () => {
    it("should return author by id", async () => {
      const mockAuthor = new Author(
        "test-id",
        AuthorName.create("Test Author"),
        "http://example.com",
        "Test bio",
        "Test description"
      );

      const mockDTO = {
        id: "test-id",
        name: "Test Author",
        link: "http://example.com",
        bio: "Test bio",
        description: "Test description",
      };

      mockRepository.findById.mockResolvedValue(mockAuthor);
      mockPresenter.toDTO.mockReturnValue(mockDTO);

      const useCase = new GetAuthorByIdUseCase(mockRepository, mockPresenter);
      const result = await useCase.execute("test-id");

      expect(result).toEqual(mockDTO);
      expect(mockRepository.findById).toHaveBeenCalledWith("test-id");
      expect(mockPresenter.toDTO).toHaveBeenCalledWith(mockAuthor);
    });

    it("should throw NotFoundError when author does not exist", async () => {
      mockRepository.findById.mockResolvedValue(null);

      const useCase = new GetAuthorByIdUseCase(mockRepository, mockPresenter);
      await expect(useCase.execute("non-existent-id")).rejects.toThrow(
        NotFoundError
      );
    });
  });
});
