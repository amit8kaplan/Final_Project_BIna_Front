import { useState } from 'react';
import { GoogleLogin } from "@react-oauth/google";
import { googleSignin } from "../services/user-service";
import apiClient from '../services/api-client'; // Ensure this is correctly importing your axios instance

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  // Existing Google login success handler
  const onGoogleLoginSuccess = async (credentialResponse) => {
    console.log(credentialResponse);
    setLoading(true);
    try {
      const res = await googleSignin(credentialResponse);
      console.log(res);
      // Redirect user or update UI accordingly
    } catch (error) {
      console.error(error);
      setLoginError('Google login failed. Please try again.');
    }
    setLoading(false);
  };

  // Google login failure handler
  const onGoogleLoginFailure = () => {
    console.log("Google login failed");
    setLoginError('Google login failed. Please try again.');
  };

  // Email and password login handler
  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault(); // Prevent the form from causing a page reload
    if (!email || !password) {
      setLoginError('Email and password must not be empty.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await apiClient.post('/auth/login', { email, password });
      console.log(data);
      // Redirect user or update UI accordingly
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.message) {
        setLoginError(error.response.data.message);
      } else {
        setLoginError('Failed to log in. Please check your email and password.');
      }
    }
    setLoading(false);
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
      {loading && <div>Loading...</div>}
    </div>
  );  
}
