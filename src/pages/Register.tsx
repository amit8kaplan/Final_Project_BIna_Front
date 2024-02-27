import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { googleSignin } from '../services/user-service';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faRandom } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import avatar from '../assets/avatar.jpeg';
import { useNavigate } from 'react-router-dom'; // Assuming you're using react-router-dom

export function Registerfunc() {
  const [imgSrc, setImgSrc] = useState();
  const [booleanRandom, setBooleanRandom] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate(); // Hook for navigation
  const schemaFormUser = z.object({
    email: z
      .string()
      .min(1, { message: "Required" })
      .email({ message: "Invalid email format" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
    userName: z.string().min(3, { message: "Username must be at least 3 characters long" }),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schemaFormUser),
  });

  const onSubmit = async (data) => {
    try {
      // Assuming your API endpoint for registration is '/auth/register'
      const response = await axios.post('http://localhost:3000/auth/register', data);
      // Store tokens in session storage
      sessionStorage.setItem("accessToken", response.data.accessToken);
      sessionStorage.setItem("refreshToken", response.data.refreshToken);
      navigate('/store'); // Redirect to store page
    } catch (error) {
      console.error("Registration error:", error.response?.data?.message || "An error occurred");
    }
  };

  const onGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const response = await googleSignin(credentialResponse);
      navigate('/store'); // Redirect to store page
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  const onGoogleLoginFailure = (error) => {
    console.error("Google login failed:", error);
  };

  const imgSelected = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImgSrc(e.target.files[0]);
      setBooleanRandom(false);
    }
  };

  const selectImg = () => {
    fileInputRef.current?.click();
  };

  const randomImg = async () => {
    setBooleanRandom(true);
    // Assuming your API for random photos is '/auth/register/randomPhoto'
    const resPhoto = await axios.get('http://localhost:3000/auth/register/randomPhoto');
    setImgSrc(resPhoto.data.url);
  };

  return (
    <div className="vstack gap-3 col-md-7 mx-auto">
      {/* Image upload section */}
      <div className="d-flex justify-content-center position-relative">
        <img
          src={imgSrc ? (booleanRandom ? imgSrc : URL.createObjectURL(imgSrc)) : avatar}
          alt="profile"
          style={{ height: "230px", width: "230px" }}
          className="img-fluid rounded-circle"
        />
        <input
          style={{ display: "none" }}
          ref={fileInputRef}
          type="file"
          onChange={imgSelected}
        />
        <button type="button" className="btn position-absolute bottom-0 end-0" onClick={selectImg}>
          <FontAwesomeIcon icon={faImage} className="fa-xl" />
        </button>
        <button type="button" className="btn position-absolute bottom-0 start-0" onClick={randomImg}>
          <FontAwesomeIcon icon={faRandom} className="fa-xl" />
        </button>
      </div>

      {/* Registration form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email input */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            {...register("email")}
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          />
          {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
        </div>

        {/* Password input */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            {...register("password")}
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          />
          {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
        </div>

        {/* Username input */}
        <div className="form-group">
          <label htmlFor="userName">Username</label>
          <input
            type="text"
            id="userName"
            {...register("userName")}
            className={`form-control ${errors.userName ? 'is-invalid' : ''}`}
          />
          {errors.userName && <div className="invalid-feedback">{errors.userName.message}</div>}
        </div>

        {/* Submit button */}
        <button type="submit" className="btn btn-primary">Register</button>
      </form>

      {/* Google login */}
      <div>
        <GoogleLogin
          onSuccess={onGoogleLoginSuccess}
          onError={onGoogleLoginFailure}
        />
      </div>
    </div>
  );
}
