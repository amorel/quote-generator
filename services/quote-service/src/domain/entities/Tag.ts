import TagName from "../value-objects/TagName";

export class Tag {
  constructor(private readonly id: string, private readonly name: TagName) {}

  getId(): string {
    return this.id;
  }

  getName(): TagName {
    return this.name;
  }
}
