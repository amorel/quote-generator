import { GetAllTagsUseCase } from "../../../../src/application/use-cases/tags/GetAllTags";
import { GetTagByIdUseCase } from "../../../../src/application/use-cases/tags/GetTagById";
import { TagRepository } from "../../../../src/infrastructure/repositories/TagRepository";
import { TagPresenter } from "../../../../src/interface/api/presenters/TagPresenter";
import { Tag } from "../../../../src/domain/entities/Tag";
import TagName from "../../../../src/domain/value-objects/TagName";
import { NotFoundError } from "../../../../src/interface/errors";
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

jest.mock("../../../../src/infrastructure/repositories/TagRepository");
jest.mock("../../../../src/interface/api/presenters/TagPresenter");

describe("Tag Use Cases", () => {
  let mockRepository: jest.Mocked<TagRepository>;
  let mockPresenter: jest.Mocked<TagPresenter>;

  beforeEach(() => {
    mockRepository = new TagRepository() as jest.Mocked<TagRepository>;
    mockPresenter = new TagPresenter() as jest.Mocked<TagPresenter>;
  });

  describe("GetAllTagsUseCase", () => {
    it("should return all tags", async () => {
      const mockTags = [
        new Tag("1", TagName.create("Tag 1")),
        new Tag("2", TagName.create("Tag 2")),
      ];

      const mockDTOs = [
        { id: "1", name: "Tag 1" },
        { id: "2", name: "Tag 2" },
      ];

      mockRepository.findAll.mockResolvedValue(mockTags);
      mockPresenter.toDTO
        .mockReturnValueOnce(mockDTOs[0])
        .mockReturnValueOnce(mockDTOs[1]);

      const useCase = new GetAllTagsUseCase(mockRepository, mockPresenter);
      const result = await useCase.execute();

      expect(result).toEqual(mockDTOs);
      expect(mockRepository.findAll).toHaveBeenCalled();
      expect(mockPresenter.toDTO).toHaveBeenCalledTimes(2);
    });
  });

  describe("GetTagByIdUseCase", () => {
    it("should return tag by id", async () => {
      const mockTag = new Tag("test-id", TagName.create("Test Tag"));
      const mockDTO = { id: "test-id", name: "Test Tag" };

      mockRepository.findById.mockResolvedValue(mockTag);
      mockPresenter.toDTO.mockReturnValue(mockDTO);

      const useCase = new GetTagByIdUseCase(mockRepository, mockPresenter);
      const result = await useCase.execute("test-id");

      expect(result).toEqual(mockDTO);
      expect(mockRepository.findById).toHaveBeenCalledWith("test-id");
      expect(mockPresenter.toDTO).toHaveBeenCalledWith(mockTag);
    });

    it("should throw NotFoundError when tag does not exist", async () => {
      mockRepository.findById.mockResolvedValue(null);

      const useCase = new GetTagByIdUseCase(mockRepository, mockPresenter);
      await expect(useCase.execute("non-existent-id")).rejects.toThrow(
        NotFoundError
      );
    });
  });
});
