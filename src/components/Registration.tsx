// import { ChangeEvent, useRef, useState } from 'react'
// import avatar from '../assets/avatar.jpeg'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faImage } from '@fortawesome/free-solid-svg-icons'
// import { uploadPhoto } from '../services/file-service'
// import { registrUser, googleSignin, IUser } from '../services/user-service'
// import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
// import {useForm} from 'react-hook-form'
// import { z } from 'zod'
// import { zodResolver } from '@hookform/resolvers/zod'
// function Registration() {


//     // refine(email => /^[^@]+@[^@]+\.[^@]+$/.test(email), {
//     //     message: "Email must match the pattern 'example@example.example'"
//     // }),
//     const schemaFormUser = z.object({
//         email: z.string().min(3),
//         password: z.string().length(8, "the password must be at least 8 characters long"),
//     });
//     type FormUser = z.infer<typeof schemaFormUser>
//     const { register, handleSubmit, formState: { errors } } = useForm<FormUser>({
//         resolver: zodResolver(schemaFormUser)
//     })
    
//     const [imgSrc, setImgSrc] = useState<File>()

//     const fileInputRef = useRef<HTMLInputElement>(null)
//     const emailInputRef = useRef<HTMLInputElement>(null)
//     const passwordInputRef = useRef<HTMLInputElement>(null)
//     const userNameInputRef = useRef<HTMLInputElement>(null)

//     const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
//         console.log(e.target.value)
//         if (e.target.files && e.target.files.length > 0) {
//             setImgSrc(e.target.files[0])
//         }
//     }
//     const selectImg = () => {
//         console.log("Selecting image...")
//         fileInputRef.current?.click()
//     }

//     const register2 = async () => {
//         console.log("Registering user...")
//         console.log(emailInputRef.current?.value)
//         console.log(passwordInputRef.current?.value)
//         // console.log(userNameInputRef.current?.value)
//     }
//     // const register = async () => {
//     //     if (emailInputRef.current?.value && passwordInputRef.current?.value) {
//     //         const user: IUser = {
//     //             email: emailInputRef.current?.value,
//     //             password: passwordInputRef.current?.value,
//     //             imgUrl: ""
//     //         }
//     //         const res = await registrUser(user)
//     //         console.log(res)
//     //         const url = await uploadPhoto(imgSrc!);
//     //         const res2 = await updateUser ({...user, imgUrl: url})
//     //     }
//     // }

//     const onGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
//         console.log(credentialResponse)
//         try {
//             const res = await googleSignin(credentialResponse)
//             console.log(res)
//         } catch (e) {
//             console.log(e)
//         }
//     }

//     const onGoogleLoginFailure = () => {
//         console.log("Google login failed")
//     }

//     return (
//         <div className="vstack gap-3 col-md-7 mx-auto">
//             <h1>Register</h1>
//             <div className="d-flex justify-content-center position-relative">
//                 <img src={imgSrc ? URL.createObjectURL(imgSrc) : avatar} style={{ height: "230px", width: "230px" }} className="img-fluid" />
//                 <button type="button" className="btn position-absolute bottom-0 end-0" onClick={selectImg}>
//                     <FontAwesomeIcon icon={faImage} className="fa-xl" />
//                 </button>
//             </div>

//             <input style={{ display: "none" }} ref={fileInputRef} type="file" onChange={imgSelected}></input>

//             <div className="form-floating">
//                 <input {...register("email")} ref={emailInputRef} type="text" className="form-control" id="floatingInput" placeholder=""  />
//                 <label htmlFor="floatingInput">Email</label>
//                 {errors.email && <p className="text-danger">{errors.email.message}</p>}
//             </div>
//             <div className="form-floating">
//                 <input  {...register("password")} ref={passwordInputRef} type="password" className="form-control" id="floatingPassword" placeholder="" />
//                 <label htmlFor="floatingPassword">Password</label>
//             </div>
//             <button type="button" className="btn btn-primary" onClick={register}>Register</button>

//             <GoogleLogin onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginFailure} />
//         </div>)
// }

// export default Registration




// <div className="vstack gap-3 col-md-7 mx-auto">
// <div className="d-flex justify-content-center position-relative">
//    <img src={imgSrc ? URL.createObjectURL(imgSrc) : avatar} style={{ height: "230px", width: "230px" }} className="img-fluid" />
//    <button type="button" className="btn position-absolute bottom-0 end-0" onClick={selectImg}>
//        <FontAwesomeIcon icon={faImage} className="fa-xl" />
//    </button>
//  </div>
{/* <input style={{ display: "none" }} ref={fileInputRef} type="file" onChange={imgSelected}></input> */}
{/* <form onSubmit={handleSubmit(onSubmit)} > */}
{/* <div className="form-floating m-3">
         <inpu {...rtegister("email")} ref={emailInputRef} type="text" className="form-control" id="floatingInput" placeholder=""  />
         <label htmlFor="floatingInput">Email</label>
         {errors.email && <p className="text-danger">{errors.email.message}</p>}
     </div>
     <div className="form-floating m-3">
         <input  {...register("password")} ref={passwordInputRef} type="password" className="form-control" id="floatingPassword" placeholder="" />
         <label htmlFor="floatingPassword">Password</label>
         {errors.email && <p className="text-danger">{errors.email.message}</p>}
     </div>
     <button type="button" className="btn btn-primary">Register</button>
</form>
<GoogleLogin onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginFailure} />
</div> */}


//   // const schemaFormUser = z.object({
//   //   email: z.string().min(3).refine(email => /^[^@]+@[^@]+\.[^@]+$/.test(email), {
//   //         message: "Email must match the pattern 'example@example.example'"
//   //     }),
//   //   password: z.string().min(8, "the password must be at least 8 characters long"),
//   // });
