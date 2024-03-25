import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {  googleSignin, loginUserWithEmailPassword, registrUser, } from '../services/user-service'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import {  useRef, useState } from 'react';
import avatar from '../assets/avatar.jpeg'
import 'bootstrap';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api-client';


export function YourComponent() {
  const navigate = useNavigate();
  const [, setEmail] = useState('');
  const [, setPassword] = useState('');
  const [, setUserName] = useState('');
  const [imgSrc, setImgSrc] = useState<File>()
  const [booleanRandom, setBooleanRandom] = useState<boolean>(false);
  const [imgError, setImgError] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [, setModalButtonLabel] = useState('');

  const handleEmailChange = (e: any) => setEmail(e.target.value);
  const handlePasswordChange = (e: any) => setPassword(e.target.value);
  const handleUserNameChange = (e: any) => setUserName(e.target.value);
  const handleModalClose = () => {
    setShowModal(false);
    setModalMessage('');
    setModalButtonLabel('');
    window.location.href = '/store';
  };
  const fileInputRef = useRef<HTMLInputElement>(null); // useRef for the file input
  
  const schemaFormUser = z.object({
    email: z.string().min(3).refine(email => /^[^@]+@[^@]+\.[^@]+$/.test(email), {
          message: "Email must match the pattern 'example@example.example'"
      }),
    password: z.string().min(8, "the password must be at least 8 characters long"),
    userName: z.string().min(3, "the user name must be at least 3 characters long")
  });
  
  type FormUser = z.infer<typeof schemaFormUser>
  const { register, handleSubmit, formState: { errors } } = useForm<FormUser>({
    resolver: zodResolver(schemaFormUser)
  })
  
  const onsubmit = async (data: any) => {
    console.log(data)
    setShowModal(false); // Ensure the modal is not shown by default on each submit attempt
    try {
        const registrationResponse = await registrUser({
            email: data.email,
            password: data.password,
            user_name: data.userName,
            imgUrl: '', // Include imgUrl if applicable
        });
        console.log("the user register:", registrationResponse);
        console.log("the imgSrc: ", imgSrc)
        const formData = new FormData();
           if (imgSrc!=null){
            formData.append('image', imgSrc);
            console.log("the formdata: ", formData)
            console.log("the register response: ", registrationResponse.accessToken)
            const upload_photo = await apiClient.post("/user", formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${registrationResponse.accessToken}`,
            },
          });
          console.log("the photo uploaded: ", upload_photo)
        
        }


        // If registration is successful, proceed to login the user
        const loginSuccess = await loginUserWithEmailPassword(data.email, data.password);
        if (loginSuccess) {
          console.log("the login success: ", loginSuccess)
            setModalMessage("Registration Successful! You are now being redirected...");
            setShowModal(true); // Show success modal
            console.log("the storage token is after loginsuccess and in reg_try:" + sessionStorage.getItem('accessToken'))
            setTimeout(() => navigate('/store'), 3000); // Redirect user to the store page after a short delay
        }
    } catch (error: any) {
        console.error("Error during registration or login:", error);
        let errorMessage = "Registration failed. Please try again.";
        if (error.response && error.response.data && error.response.data.message) {
            // Use the error message from the backend if available
            errorMessage = error.response.data.message;
        }
        setModalMessage(errorMessage);
        setShowModal(true); // Optionally, use a different mechanism to show error messages if not using the modal for this purpose
    }
};
  
  const onGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    console.log(credentialResponse)
    try {
        const res = await googleSignin(credentialResponse)
        console.log(res)
    } catch (e) {
        console.log(e)
    }
}

const onGoogleLoginFailure = () => {
    console.log("Google login failed")
}

const imgSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const allowedTypes = ['image/jpeg', 'image/png']; // Add more image types if needed
      if (allowedTypes.includes(file.type)) {
        setImgSrc(file);
        setBooleanRandom(false);
        setImgError(''); // Clear any previous error message
      } else {
        setImgError('Please select a valid image file (JPEG, PNG).');
      }
    }
  };
const selectImg = () => {
  console.log("Selecting image...")
  if (fileInputRef.current) {
    fileInputRef.current.click();
    console.log("Selecting image..." + fileInputRef.current)
  }
}


return (
  <div className="vstack gap-3 col-md-7 mx-auto">
    <div className="d-flex justify-content-center position-relative">
      <img src={imgSrc ? (booleanRandom ? imgSrc : URL.createObjectURL(imgSrc)) : avatar} style={{ height: "230px", width: "230px" }} className="img-fluid" />
      <button type="button" className="btn position-absolute bottom-0 end-0" onClick={selectImg}>
        <FontAwesomeIcon icon={faImage} className="fa-xl" />
      </button>
    </div>
    {imgError && <p className="text-danger">{imgError}</p>}
    <input style={{ display: "none" }} ref={fileInputRef} type="file" onChange={imgSelected} />
    
    <form onSubmit={handleSubmit(onsubmit)} className="mt-4">
      <div className="form-group mb-3">
        <input type="text" id="email" {...register('email')} placeholder="Email" className='form-control form-input' onChange={handleEmailChange} />
        {errors.email && <div className="text-danger">{errors.email.message}</div>}
      </div>
      <div className="form-group mb-3">
        <input type="password" id="password" {...register('password')} placeholder="Password" className='form-control form-input' onChange={handlePasswordChange} />
        {errors.password && <div className="text-danger">{errors.password.message}</div>}
      </div>
      <div className="form-group mb-4">
        <input type="text" id="userName" {...register('userName')} placeholder="User Name" className='form-control form-input' onChange={handleUserNameChange} />
        {errors.userName && <div className="text-danger">{errors.userName.message}</div>}
      </div>
      <button type="submit" className="btn btn-primary w-100">Register</button>
    </form>

    <GoogleLogin onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginFailure} />
    
    {showModal && (

      <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1} aria-labelledby="ModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="ModalLabel">Registration Message</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleModalClose}></button>
            </div>
            <div className="modal-body">
              {modalMessage}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleModalClose}>Close</button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);
}

export default YourComponent;