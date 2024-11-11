import { AuthProvider } from "./contexts/AuthContext";
import { ViewCounter } from "./components/ViewCounter/ViewCounter";
import { Router } from "./router";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <ViewCounter />
      <Router />
    </AuthProvider>
  );
}

export default App;