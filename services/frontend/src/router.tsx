import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";
import { Login } from "./components/Auth/Login";
import { Register } from "./components/Auth/Register";
import { Quote } from "./components/Quote/Quote";

const routes = [
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <div>
          <h1>Quote Generator</h1>
          <Quote />
        </div>
      </ProtectedRoute>
    )
  }
];

const router = createBrowserRouter(routes, {
  future: {
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true
  }
});

export function Router() {
  return <RouterProvider router={router} />;
}