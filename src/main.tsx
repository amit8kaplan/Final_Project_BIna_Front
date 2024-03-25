import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { BrowserRouter } from 'react-router-dom'
ReactDOM.createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId="355260854480-u3elnibbro9ks8jg7c608f00g5rne6jn.apps.googleusercontent.com">
    <React.StrictMode>
      <BrowserRouter>
      <App />
    </BrowserRouter>
    </React.StrictMode>
  </GoogleOAuthProvider>
)










