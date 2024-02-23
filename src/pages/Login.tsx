import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { googleSignin } from "../services/user-service";

export function Login() {
  const onGoogleLoginSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    console.log(credentialResponse);
    try {
      const res = await googleSignin(credentialResponse);
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };

  const onGoogleLoginFailure = () => {
    console.log("Google login failed");
  };

  return (
    <div>
      <h1>Login</h1>
      <GoogleLogin
        onSuccess={onGoogleLoginSuccess}
        onError={onGoogleLoginFailure}
      />
    </div>
  );
}
