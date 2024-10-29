export default class AuthorName {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static create(name: string): AuthorName {
    if (!name || name.trim().length === 0) {
      throw new Error("Author name cannot be empty");
    }
    if (name.length > 100) {
      throw new Error("Author name cannot exceed 100 characters");
    }
    return new AuthorName(name.trim());
  }

  public getValue(): string {
    return this.value;
  }
}
