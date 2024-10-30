export default class TagName {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static create(name: string): TagName {
    if (!name || name.trim().length === 0) {
      throw new Error("Tag name cannot be empty");
    }
    if (name.length > 50) {
      throw new Error("Tag name cannot exceed 50 characters");
    }
    return new TagName(name.trim());
  }

  public getValue(): string {
    return this.value;
  }
}
