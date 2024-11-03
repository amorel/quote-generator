class LocalStorageMock implements Storage {
  private store: { [key: string]: string } = {};

  clear(): void {
    this.store = {};
  }

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  get length(): number {
    return Object.keys(this.store).length;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }
}

Object.defineProperty(window, "localStorage", {
  value: new LocalStorageMock(),
});

global.fetch = jest.fn(
  () =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    }) as Promise<Response>
);

afterEach(() => {
  jest.clearAllMocks();
  window.localStorage.clear();
});
