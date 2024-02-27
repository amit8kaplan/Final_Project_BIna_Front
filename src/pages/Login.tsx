import { useState } from 'react';
import { GoogleLogin } from "@react-oauth/google";
import { googleSignin } from "../services/user-service";
import apiClient from '../services/api-client'; // Ensure this is correctly importing your axios instance
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Existing Google login success handler
  const onGoogleLoginSuccess = async (credentialResponse: any) => {
    try {
      const res = await googleSignin(credentialResponse);
      sessionStorage.setItem("accessToken", res.accessToken);
      sessionStorage.setItem("refreshToken", res.refreshToken);
      window.dispatchEvent(new CustomEvent('sessionStorageChange', { detail: { accessToken: res.accessToken } }));
      
      navigate('/store'); // Redirect to store page
    } catch (error) {
      console.error(error);
      // Handle error, potentially set an error state here
    }
  };
  

  // Google login failure handler
  const onGoogleLoginFailure = () => {
    console.log("Google login failed");
    // Handle Google login failure
  };

  // Email and password login handler
  const handleEmailPasswordLogin = async (e: any) => {
    e.preventDefault();
    if (!email || !password) {
      setLoginError('Email and password must not be empty.');
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
      <form onSubmit={handleEmailPasswordLogin} className="login-form">
        {loginError && <div className="login-error">{loginError}</div>}
        <div className="input-group">
          <label>Email:</label>
          <input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
      <div className="google-login-container">
        <GoogleLogin
          onSuccess={onGoogleLoginSuccess}
          onError={onGoogleLoginFailure}
        />
      </div>
    </div>
  );  
}
