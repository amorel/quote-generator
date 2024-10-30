import { TagDTO } from "../../../../src/application/dtos/TagDTO";
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

describe("TagDTO", () => {
  it("should have correct structure", () => {
    const tagDTO: TagDTO = {
      id: "test-id",
      name: "Test Tag",
    };

    expect(tagDTO).toHaveProperty("id");
    expect(tagDTO).toHaveProperty("name");
  });

  it("should contain string values", () => {
    const tagDTO: TagDTO = {
      id: "test-id",
      name: "Test Tag",
    };

    expect(typeof tagDTO.id).toBe("string");
    expect(typeof tagDTO.name).toBe("string");
  });
});
