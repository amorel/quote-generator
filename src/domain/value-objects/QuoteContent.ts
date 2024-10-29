import { ValidationError } from "../../errors";

export default class QuoteContent {
  private readonly value: string;

  private constructor(content: string) {
    this.value = content;
    Object.freeze(this);
  }

  public static create(content: string): QuoteContent {
    if (!content || content.trim().length === 0) {
      throw new ValidationError("Quote content cannot be empty");
    }
    if (content.length > 500) {
      throw new ValidationError("Quote content cannot exceed 500 characters");
    }
    return new QuoteContent(content.trim());
  }

  public getValue(): string {
    return this.value;
  }
}
