import { ValidationError } from "../../errors";

export default class TagName {
  private readonly value: string;

  private constructor(name: string) {
    this.value = name;
    Object.freeze(this);
  }

  public static create(name: string): TagName {
    if (!name || name.trim().length === 0) {
      throw new ValidationError("Tag name cannot be empty");
    }
    if (name.length > 50) {
      throw new ValidationError("Tag name cannot exceed 50 characters");
    }
    return new TagName(name.trim());
  }

  public getValue(): string {
    return this.value;
  }
}