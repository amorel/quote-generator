# Frontend Service - Quote Generator

React/TypeScript frontend application for Quote Generator, providing a modern and responsive user interface for displaying random quotes and managing user preferences.

## Table of Contents

- [Frontend Service - Quote Generator](#frontend-service---quote-generator)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Architecture](#architecture)
    - [Component Structure](#component-structure)
    - [Technologies Used](#technologies-used)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Environment Variables](#environment-variables)
    - [Installation](#installation)
  - [User Interface](#user-interface)
    - [Pages](#pages)
      - [Home Page](#home-page)
      - [Authentication Pages](#authentication-pages)
      - [User Profile](#user-profile)
    - [Components](#components)
      - [QuoteCard](#quotecard)
  - [State Management](#state-management)
    - [Redux Store Structure](#redux-store-structure)
    - [Actions](#actions)
  - [Authentication](#authentication)
    - [Auth Context](#auth-context)
    - [Protected Routes](#protected-routes)
  - [Testing](#testing)
    - [Test Examples](#test-examples)
  - [Development](#development)
    - [Code Style](#code-style)
    - [Debug Mode](#debug-mode)
    - [Development Tools](#development-tools)
    - [Best Practices](#best-practices)
  - [Deployment](#deployment)
    - [Docker Build](#docker-build)
    - [Production Build](#production-build)
    - [Nginx Configuration](#nginx-configuration)

## Features

- 🎯 Random quote display
- 🔐 User authentication
- ⭐ Favorite quotes management
- 🎨 Theme customization
- 📱 Responsive design
- 🔄 State persistence
- 📊 Reading history
- 🌐 Offline support

## Architecture

### Component Structure

```plaintext
src/
├── components/           # React components
│   ├── Auth/            # Authentication components
│   ├── Quote/           # Quote-related components
│   ├── UserProfile/     # User profile components
│   └── Debug/           # Debug components
├── contexts/            # React contexts
│   └── AuthContext/     # Authentication context
├── hooks/               # Custom React hooks
├── services/            # API service integrations
├── store/              # Redux store configuration
│   └── slices/         # Redux slices
└── types/              # TypeScript type definitions
```

### Technologies Used

- React 18
- TypeScript
- Redux Toolkit
- React Router
- Vite
- Jest
- Testing Library

## Getting Started

### Prerequisites

- Node.js >= 20.x
- npm or yarn

### Environment Variables

```env
VITE_API_URL=http://localhost:3000
VITE_PORT=3006
```

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## User Interface

### Pages

#### Home Page

```typescript
// Quote display with navigation
function Quote() {
  return (
    <div className={styles.container}>
      <blockquote className={styles.quote}>
        <p>{current.content}</p>
        <footer>— {current.author}</footer>
      </blockquote>
      <button onClick={() => dispatch(fetchRandomQuote())}>Next Quote</button>
    </div>
  );
}
```

#### Authentication Pages

- Login
- Registration
- Password Reset

#### User Profile

- Preferences Management
- Reading History
- Favorite Quotes

### Components

#### QuoteCard

```typescript
interface QuoteCardProps {
  quote: Quote;
  onFavorite: (id: string) => void;
}

function QuoteCard({ quote, onFavorite }: QuoteCardProps) {
  return (
    <div className={styles.card}>
      <p>{quote.content}</p>
      <button onClick={() => onFavorite(quote.id)}>⭐ Favorite</button>
    </div>
  );
}
```

## State Management

### Redux Store Structure

```typescript
interface RootState {
  quote: {
    current: Quote | null;
    history: Quote[];
    loading: boolean;
    error: string | null;
  };
  auth: {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
  };
}
```

### Actions

```typescript
// Quote Actions
export const fetchRandomQuote = createAsyncThunk(
  "quote/fetchRandom",
  async () => {
    return await quoteService.getRandomQuote();
  }
);

// Auth Actions
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials) => {
    return await authService.login(credentials);
  }
);
```

## Authentication

### Auth Context

```typescript
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
}
```

### Protected Routes

```typescript
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
```

## Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Examples

```typescript
describe("Quote Component", () => {
  it("displays quote content", () => {
    render(<Quote />);
    expect(screen.getByText(/quote content/i)).toBeInTheDocument();
  });

  it("fetches new quote on button click", async () => {
    render(<Quote />);
    fireEvent.click(screen.getByText(/next quote/i));
    await waitFor(() => {
      expect(screen.getByText(/new quote/i)).toBeInTheDocument();
    });
  });
});
```

## Development

### Code Style

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"
  ]
}
```

### Debug Mode

```bash
# Enable React DevTools
localStorage.setItem('debug', 'quote-generator:*');
```

### Development Tools

- React DevTools
- Redux DevTools
- Vite DevTools

### Best Practices

1. Component composition
2. Custom hooks
3. Memoization
4. Error boundaries
5. Accessibility

## Deployment

### Docker Build

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3006
ENV VITE_PORT=3006
CMD ["npm", "run", "dev"]
```

### Production Build

```bash
# Build
npm run build

# Preview build
npm run preview
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://api-gateway:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
