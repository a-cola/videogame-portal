import { useContext, useRef, useState } from "react";
import { GoogleIcon } from "./Icons";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { auth } from "./main";
import { GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

export function LoginPage () {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const [loginError, setLoginError] = useState(false);
    const [registerError, setRegisterError] = useState(false);
    const [googleError, setGoogleError] = useState(false);

    const navigate = useNavigate();

    const userCtx = useContext(UserContext);

    if(userCtx!.currentUser !== null)
        navigate('/');

    const loginWithGoogle = () => {
        const provider = new GoogleAuthProvider();

        const isMobile = () => {
            const devices = [
                /Android/i,
                /webOS/i,
                /iPhone/i,
                /iPad/i,
                /iPod/i,
                /BlackBerry/i,
                /Windows Phone/i
            ];

            return devices.some((device)=>{
                return navigator.userAgent.match(device);
            })
        }

        if(isMobile()) {
            signInWithRedirect(auth, provider)
                .then(() => navigate(-1))
                .catch((error) => {
                    console.error(error);
                    setGoogleError(true);
                    setLoginError(false);
                    setRegisterError(false);
                })
        }
        else {
            signInWithPopup(auth, provider)
                .then(() => navigate(-1))
                .catch((error) => {
                    console.error(error);
                    setGoogleError(true);
                    setLoginError(false);
                    setRegisterError(false);
                })
        }
    }

    const login = () => {
        if(emailRef.current!.value !== null && passwordRef.current!.value !== null)
            signInWithEmailAndPassword(auth, emailRef.current!.value, passwordRef.current!.value)
                .then(()=>navigate(-1))
                .catch((error) => {
                    console.error(error);
                    setLoginError(true);
                    setRegisterError(false);
                    setGoogleError(false);
                })
    }

    const register = () => {
        if(emailRef.current!.value !== null && passwordRef.current!.value !== null)
            createUserWithEmailAndPassword(auth, emailRef.current!.value, passwordRef.current!.value)
                .then(()=>navigate(-1))
                .catch((error) => {
                    console.error(error);
                    setRegisterError(true);
                    setLoginError(false);
                    setGoogleError(false);
                })
    }

    return <>
        <div className="login-container">
            <div className="login-form-container">
                <button className="to-home-button" onClick={()=>navigate(-1)}>&times;</button>
                <div className="login-form">
                    <img src="./VGP_Logo.png" />
                    <input
                        type="text"
                        placeholder="Insert e-mail"
                        ref={emailRef}
                        />
                    <input
                        type="password" 
                        placeholder="Insert password"
                        ref={passwordRef}
                        />
                    <div className="login-register-buttons">
                        <button type="button" className="sign-in-button" onClick={login}>Sign in</button>
                        <button type="button" className="register-button" onClick={register}>Register</button>
                    </div>
                    <button type="button" className="google-button" onClick={loginWithGoogle}>
                        <span>Sign in with Google</span>
                        <GoogleIcon />
                    </button>
                    {loginError?<span className="signin-error">Wrong email or password</span>:<></>}
                    {registerError?<span className="signin-error">Invalid email</span>:<></>}
                    {googleError?<span className="signin-error">Error signing in with Google</span>:<></>}
                </div>
            </div>
        </div>
    </>
}