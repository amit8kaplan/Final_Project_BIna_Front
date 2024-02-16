import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { BrowserRouter } from 'react-router-dom'
ReactDOM.createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId="764938356434-9sg7heli6dv8nj6rlobhhjlq18ui5dpr.apps.googleusercontent.com">
    <React.StrictMode>
      <BrowserRouter>
      <App />
    </BrowserRouter>
    </React.StrictMode>
  </GoogleOAuthProvider>
)










