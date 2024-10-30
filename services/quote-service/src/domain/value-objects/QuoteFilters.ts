import { ValidationError } from "../../interface/errors";

export class QuoteFilters {
  private constructor(
    public readonly limit?: number,
    public readonly maxLength?: number,
    public readonly minLength?: number,
    public readonly tags?: readonly string[],
    public readonly author?: string
  ) {
    // Geler l'objet et les tableaux pour une immutabilité complète
    Object.freeze(this);
    if (this.tags) {
      Object.freeze(this.tags);
    }
  }

  public static create(filters: {
    limit?: number;
    maxLength?: number;
    minLength?: number;
    tags?: string;
    author?: string;
  }): QuoteFilters {
    // Validate limit
    if (filters.limit !== undefined) {
      if (filters.limit < 1 || filters.limit > 50) {
        throw new ValidationError("Limit must be between 1 and 50");
      }
    }

    // Validate lengths
    if (filters.maxLength !== undefined && filters.maxLength < 0) {
      throw new ValidationError("Maximum length cannot be negative");
    }
    if (filters.minLength !== undefined && filters.minLength < 0) {
      throw new ValidationError("Minimum length cannot be negative");
    }
    if (
      filters.maxLength !== undefined &&
      filters.minLength !== undefined &&
      filters.minLength > filters.maxLength
    ) {
      throw new ValidationError(
        "Minimum length cannot be greater than maximum length"
      );
    }

    // Process tags
    let processedTags: string[] | undefined;
    if (filters.tags) {
      processedTags = filters.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
      if (processedTags.length === 0) {
        processedTags = undefined;
      }
    }

    const processedAuthor = filters.author?.trim() || undefined;

    return new QuoteFilters(
      filters.limit,
      filters.maxLength,
      filters.minLength,
      processedTags,
      processedAuthor
    );
  }
}
