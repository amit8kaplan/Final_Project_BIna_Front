import { useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { googleSignin } from '../services/user-service';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import avatar from '../assets/avatar.jpeg';
import { useNavigate } from 'react-router-dom'; // Assuming you're using react-router-dom

export function Registerfunc() {
  const [imgSrc, setImgSrc] = useState();
  const [booleanRandom,] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  type FormFields = {
    email: string;
    password: string;
    username: string;
    imgUrl: string; 
  };


  
  const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
    try {
        const response = await axios.post('http://localhost:3000/auth/register', {
            email: data.email,
            password: data.password,
            username: data.username,
            imgUrl: data.imgUrl || '',
        });
  
        if (response.status === 201) {
            // Handle successful registration
            const { accessToken, refreshToken } = response.data.tokens;
            sessionStorage.setItem("accessToken", accessToken);
            sessionStorage.setItem("refreshToken", refreshToken);
            navigate('/store'); // Redirect on successful registration
        } else {
            // Handle errors or unsuccessful registration
            throw new Error(response.data.message || "Registration failed. Please try again.");
        }
      } catch (error: any) {
        console.error("Registration error:", error);
        alert(error.response?.data?.message || "Registration failed. Please try again.");
      }      
  };
  

  const onGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      await googleSignin(credentialResponse);
      navigate('/store'); // Redirect to store page
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };
  

  const onGoogleLoginFailure = () => {
    console.error("Google login failed");
  };
  

  const imgSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // @ts-ignore
      setImgSrc(URL.createObjectURL(file)); // Assuming setImgSrc is expecting a string URL
    }
  };
  

  const selectImg = () => {
    fileInputRef.current?.click();
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
          {errors.email && <div className="invalid-feedback">{errors.email.message as string}</div>}
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
          {errors.password && <div className="invalid-feedback">{errors.password.message as string}</div>}
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
          {errors.userName && <div className="invalid-feedback">{errors.userName.message as string}</div>}
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
