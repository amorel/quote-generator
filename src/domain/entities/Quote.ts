import QuoteContent from "../value-objects/QuoteContent";

export class Quote {
  constructor(
    private readonly id: string,
    private readonly content: QuoteContent,
    private readonly authorId: string,
    private readonly tags: string[]
  ) {}

  public getId(): string {
    return this.id;
  }

  public getContent(): QuoteContent {
    return this.content;
  }

  public getAuthorId(): string {
    return this.authorId;
  }

  public getTags(): string[] {
    return [...this.tags];
  }
}
