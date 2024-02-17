import 'bootstrap/dist/css/bootstrap.min.css';
import { FieldValues, useForm} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { registrUser, googleSignin, IUser } from '../services/user-service'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { ChangeEvent, useRef, useState } from 'react';
import avatar from '../assets/avatar.jpeg'



export function Registerfunc() {
      const [imgSrc, setImgSrc] = useState<File>()
    const fileInputRef = useRef<HTMLInputElement>(null)
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

const onSubmit = (data: FieldValues) => {

  const user = {
    email: data.email,
    password: data.password,
    userName: data.userName
  }
  console.log(user)
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
        const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)
        if (e.target.files && e.target.files.length > 0) {
            setImgSrc(e.target.files[0])
        }
    }
    const selectImg = () => {
        console.log("Selecting image...")
        fileInputRef.current?.click()
    }

  return (
    <div className="vstack gap-3 col-md-7 mx-auto">
      <div className="d-flex justify-content-center position-relative">
        <img src={imgSrc ? URL.createObjectURL(imgSrc) : avatar} style={{ height: "230px", width: "230px" }} className="img-fluid" />
        <button type="button" className="btn position-absolute bottom-0 end-0" onClick={selectImg}>
            <FontAwesomeIcon icon={faImage} className="fa-xl" />
        </button>
      </div>
      <input style={{ display: "none" }} ref={fileInputRef} type="file" onChange={imgSelected}></input>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-floating m-3" >
          <input type="text" id="email" {...register('email')} className='form-control'  /> 
          {errors.email && <p className="text-danger">{errors.email.message}</p>}
          <label htmlFor="email">Email</label>
        </div>
        <div className="form-floating m-3"  >
          <input type="password" id="password" {...register('password')} className='form-control' />
          {errors.password && <p className="text-danger">{errors.password.message}</p>}
          <label htmlFor="password">Password</label>
        </div>
        <div className="form-floating m-3"  >
          <input type="userName" id="userName" {...register('userName')} className='form-control' />
          {errors.userName && <p className="text-danger">{errors.userName.message}</p>}
          <label htmlFor="userName">User Name</label>
        </div>
          <button type="submit" className="btn btn-primary">Register</button>
      </form>
      <GoogleLogin onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginFailure} />
    </div>
  );
}
