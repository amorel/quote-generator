interface UserJSON {
  id: string;
  email: string;
  role: string;
}

export class User {
  constructor(
    private readonly id: string,
    private readonly email: string,
    private readonly password: string,
    private readonly role: string
  ) {}

  public getId(): string {
    return this.id;
  }

  public getEmail(): string {
    return this.email;
  }

  public getPassword(): string {
    return this.password;
  }

  public getRole(): string {
    return this.role;
  }

  public hasRole(role: string): boolean {
    return this.role === role;
  }

  public toJSON(): UserJSON {
    return {
      id: this.id,
      email: this.email,
      role: this.role,
    };
  }
}
