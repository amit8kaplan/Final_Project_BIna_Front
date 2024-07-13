import { useState } from 'react';

import apiClient from '../services/api-client'; // Ensure this is correctly importing your axios instance
import { useNavigate } from 'react-router-dom';
// import '../css/schoolImg.css'; // Import the CSS file for styling
import '../css/Login.css'; // Import the CSS file for styling
export function Login() {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();



  // Email and password login handler
  const handleLogin = async (e: any) => {
    e.preventDefault();
    if (!userName || !password) {
      setLoginError('UserName and password must not be empty.');
      return;
    }
    try {
      setLoading(true);
      const { data } = await apiClient.post('/auth/login', { email, password });
      sessionStorage.setItem("accessToken", data.accessToken);
      sessionStorage.setItem("refreshToken", data.refreshToken);
      window.dispatchEvent(new CustomEvent('sessionStorageChange', { detail: { accessToken: data.accessToken } }));
      
      navigate('/store'); // Redirect to store page
    } catch (error: any) {
      console.error(error);
      setLoginError(error.response?.data?.message || 'Failed to log in. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };
  
  
  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin} className="login-form">
        {loginError && <div className="alert alert-danger" role="alert">{loginError}</div>}
        <div className="input-group">
          <label>User name:</label>
          <input
            name="UserName"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Password:</label>
          <input
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );  
}
