import "@testing-library/jest-dom";

// Définition de l'interface Window avec ENV
declare global {
  interface Window {
    ENV?: {
      VITE_API_URL?: string;
    };
  }
}

// Mock du localStorage
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

// Configuration de l'environnement global
Object.defineProperty(window, "localStorage", {
  value: new LocalStorageMock(),
});

// Mock de l'environnement Vite
Object.defineProperty(window, "ENV", {
  value: {
    VITE_API_URL: "http://localhost:3000",
  },
  writable: true,
});

// Mock de fetch global
global.fetch = jest.fn(
  () =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
      headers: new Headers({
        "content-type": "application/json",
      }),
    }) as Promise<Response>
);

// Mock de console.error pour les tests
console.error = jest.fn();

// Nettoyage après chaque test
afterEach(() => {
  jest.clearAllMocks();
  window.localStorage.clear();
});
