import { AuthProvider } from "./contexts/AuthContext";
import { ViewCounter } from "./components/ViewCounter/ViewCounter";
import MonitoringLinks from './components/MonitoringLinks';
import { Router } from "./router";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <ViewCounter />
      <Router />
      <MonitoringLinks />
    </AuthProvider>
  );
}

export default App;