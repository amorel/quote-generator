export class User {
  constructor(
    private id: string,
    private email: string,
    private role: string
  ) {}

  getId(): string {
    return this.id;
  }
  getEmail(): string {
    return this.email;
  }
  getRole(): string {
    return this.role;
  }
}
