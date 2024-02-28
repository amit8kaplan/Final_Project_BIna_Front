import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {  IUser, googleSignin, registrUser, } from '../services/user-service'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faRandom } from '@fortawesome/free-solid-svg-icons';
import {  MouseEventHandler, useRef, useState } from 'react';
import avatar from '../assets/avatar.jpeg'
import axios from 'axios';
import { uploadPhoto } from '../services/file-service';
import 'bootstrap';


export function YourComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [imgSrc, setImgSrc] = useState<File>()
  const [booleanRandom, setBooleanRandom] = useState<boolean>(false);
  const [imgError, setImgError] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalButtonLabel, setModalButtonLabel] = useState('');
  const [modalButtonAction, setModalButtonAction] = useState(() => {});

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleUserNameChange = (e) => setUserName(e.target.value);
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
  
  const onsubmit = async () => {
    try{
        if (email!= '' && password != '' && userName != '') {
            console.log("Registering user...")
            const user: IUser = {
                email: email,
                password: password,
                imgUrl: "",
                user_name: userName
            }
            console.log(user)
            const res = await registrUser(user)
            console.log("the user resgister:" +JSON.stringify(res, null, 2))
            localStorage.setItem('token', res.accessToken!);
            console.log("the token:" +localStorage.getItem('token'));
            if (imgSrc) {
                const url = await uploadPhoto(imgSrc!,res.accessToken! );
                console.log("the url of the photo:" +url)
            }
        }

    } catch (e) {
        console.log(e)
    }
   
}
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
const randomImg =async () => {
  console.log("Random image...")
  setBooleanRandom(true)
  const resPhoto = await axios.get("http://localhost:3000/auth/register/randomphoto")
  console.log(resPhoto.data.url.toString())
  console.log("type of resPhoto: ", typeof resPhoto.data.url.toString())
  console.log("Random image...")
  console.log(JSON.stringify(resPhoto, null, 2))
  // const photourtostring toString() // Remove the argument
  setImgSrc(resPhoto.data.url)
}

  return (
    <div className="vstack gap-3 col-md-7 mx-auto">
      <div className="d-flex justify-content-center position-relative">
        <img src={imgSrc ? (booleanRandom ? imgSrc : URL.createObjectURL(imgSrc) ) : avatar} style={{ height: "230px", width: "230px" }} className="img-fluid" />
            <button type="button" className="btn position-absolute bottom-0 end-0" onClick={selectImg}>
                <FontAwesomeIcon icon={faImage} className="fa-xl" />
            </button>
            <button type="button" className="btn position-absolute bottom-0 start-0" onClick={randomImg}>
                <FontAwesomeIcon icon={faRandom} className="fa-xl" />
            </button>
      </div>
      {imgError && <p className="text-danger">{imgError}</p>}
      <input style={{ display: "none" }} ref={fileInputRef} type="file" onChange={imgSelected}></input>
      <div className="form-floating m-3">
        <input type="text" id="email" {...register('email')} value={email} onChange={handleEmailChange} className='form-control' />
        {errors.email && <p className="text-danger">{errors.email.message}</p>}
        <label htmlFor="email">Email</label>
      </div>
      <div className="form-floating m-3">
        <input type="password" id="password" {...register('password')} value={password} onChange={handlePasswordChange} className='form-control' />
        {errors.password && <p className="text-danger">{errors.password.message}</p>}
        <label htmlFor="password">Password</label>
      </div>
      <div className="form-floating m-3">
        <input type="text" id="userName"  {...register('userName')} value={userName} onChange={handleUserNameChange} className='form-control' />
        {errors.userName && <p className="text-danger">{errors.userName.message}</p>}
        <label htmlFor="userName">User Name</label>
      </div>
      <button type="button" onClick={handleSubmit(onsubmit)} className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#Modal">Register</button>
      <GoogleLogin onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginFailure} />
        <div className="modal fade" id="Modal" tabIndex={-1} aria-labelledby="ModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="ModalLabel">Registraion Success!</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    hello {userName}!<br/>
                    You have been registered successfully! <br/>
                    This is the place to investigate the world of knowledge!

                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => handleModalClose()}>Let's GO!</button>
                </div>
                </div>
            </div>
        </div>
      
    </div>

    
  );
}

export default YourComponent;



// {showModal && (
//     <div className="modal fade show" id="Modal" tabIndex={-1} aria-labelledby="ModalLabel" aria-hidden="true" style={{ display: 'block' }}>
//     <div className="modal-dialog">
//         <div className="modal-content">
//             <div className="modal-header">
//                 <h1 className="modal-title fs-5" id="ModalLabel">{modalMessage}</h1>
//                 <button type="button" className="btn-close" aria-label="Close" onClick={handleModalClose}></button>
//             </div>
//             <div className="modal-body">
//                 {/* Your modal body content */}
//             </div>
//             <div className="modal-footer">
//                 <button type="button" className="btn btn-secondary" onClick={modalButtonAction}>{modalButtonLabel}</button>
//             </div>
//         </div>
//     </div>
// )}