import AuthorName from "../value-objects/AuthorName";

export class Author {
  constructor(
    private readonly id: string,
    private readonly name: AuthorName,
    private readonly link: string | undefined,
    private readonly bio: string,
    private readonly description: string
  ) {}

  public getId(): string {
    return this.id;
  }

  public getName(): AuthorName {
    return this.name;
  }

  public getLink(): string | undefined {
    return this.link;
  }

  public getBio(): string {
    return this.bio;
  }

  public getDescription(): string {
    return this.description;
  }
}
