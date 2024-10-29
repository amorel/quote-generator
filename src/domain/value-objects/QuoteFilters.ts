import { ValidationError } from "../../errors";

interface QuoteFiltersProps {
  limit?: number;
  maxLength?: number;
  minLength?: number;
  tags?: string;
  author?: string;
}

export class QuoteFiltersVO {
  private readonly _limit: number;
  private readonly _maxLength?: number;
  private readonly _minLength?: number;
  private readonly _tags: string[];
  private readonly _author?: string;

  private constructor(props: QuoteFiltersProps) {
    this._limit = this.validateLimit(props.limit ?? 1);
    this._maxLength = props.maxLength;
    this._minLength = props.minLength;
    this._tags = this.parseTags(props.tags);
    this._author = props.author;
  }

  private validateLimit(limit: number): number {
    if (limit < 1 || limit > 50) {
      throw new ValidationError("Limit must be between 1 and 50");
    }
    return limit;
  }

  private parseTags(tags?: string): string[] {
    if (!tags) {
      return [];
    }
    return tags.split(",").map((tag) => tag.trim());
  }

  public static create(props: QuoteFiltersProps): QuoteFiltersVO {
    return new QuoteFiltersVO(props);
  }

  get limit(): number {
    return this._limit;
  }

  get maxLength(): number | undefined {
    return this._maxLength;
  }

  get minLength(): number | undefined {
    return this._minLength;
  }

  get tags(): string[] {
    return [...this._tags];
  }

  get author(): string | undefined {
    return this._author;
  }
}
