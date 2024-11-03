import { useAuth } from '../../contexts/AuthContext';
import { tokenService } from '../../services/tokenService';

export const AuthDebug = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Auth Debug Info</h3>
      <div>
        <p>IsAuthenticated: {String(isAuthenticated)}</p>
        <p>Token: {tokenService.getToken()?.substring(0, 20)}...</p>
        <p>User: {JSON.stringify(user, null, 2)}</p>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
};