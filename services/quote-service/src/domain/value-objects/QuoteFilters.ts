import { ValidationError } from "../../interface/errors";

export class QuoteFilters {
  private constructor(
    public readonly limit?: number,
    public readonly maxLength?: number,
    public readonly minLength?: number,
    public readonly tags?: readonly string[],
    public readonly tagsOperator: "AND" | "OR" = "AND",
    public readonly author?: string
  ) {
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
    // Validations existantes...
    if (filters.limit !== undefined) {
      if (filters.limit < 1 || filters.limit > 50) {
        throw new ValidationError("Limit must be between 1 and 50");
      }
    }

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

    // Traitement amélioré des tags
    let processedTags: string[] | undefined;
    let tagsOperator: "AND" | "OR" = "AND";

    if (filters.tags) {
      if (filters.tags.includes("|")) {
        processedTags = filters.tags
          .split("|")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);
        tagsOperator = "OR";
      } else {
        processedTags = filters.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);
      }

      if (processedTags.length === 0) {
        processedTags = undefined;
      }

      // Validation supplémentaire des tags
      if (processedTags) {
        processedTags.forEach((tag) => {
          if (tag.length < 2) {
            throw new ValidationError(
              "Tags must be at least 2 characters long"
            );
          }
          if (tag.length > 50) {
            throw new ValidationError("Tags must not exceed 50 characters");
          }
        });
      }
    }

    // Validation de l'auteur
    const processedAuthor = filters.author?.trim();
    if (processedAuthor !== undefined) {
      if (processedAuthor.length < 2) {
        throw new ValidationError(
          "Author name must be at least 2 characters long"
        );
      }
      if (processedAuthor.length > 100) {
        throw new ValidationError("Author name must not exceed 100 characters");
      }
    }

    return new QuoteFilters(
      filters.limit,
      filters.maxLength,
      filters.minLength,
      processedTags,
      tagsOperator,
      processedAuthor
    );
  }

  // Méthodes utilitaires pour faciliter l'utilisation
  public hasLengthFilters(): boolean {
    return this.maxLength !== undefined || this.minLength !== undefined;
  }

  public hasTags(): boolean {
    return this.tags !== undefined && this.tags.length > 0;
  }

  public isTagsAND(): boolean {
    return this.tagsOperator === "AND";
  }

  public hasAuthor(): boolean {
    return this.author !== undefined && this.author.length > 0;
  }

  public toQueryObject(): Record<string, any> {
    const query: Record<string, any> = {};

    if (this.limit !== undefined) query.limit = this.limit;
    if (this.maxLength !== undefined) query.maxLength = this.maxLength;
    if (this.minLength !== undefined) query.minLength = this.minLength;
    if (this.tags) {
      query.tags = this.tags.join(this.tagsOperator === "AND" ? "," : "|");
    }
    if (this.author !== undefined) query.author = this.author;

    return query;
  }
}
