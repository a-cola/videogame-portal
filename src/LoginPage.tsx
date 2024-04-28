import { useRef } from "react";
import { GoogleIcon } from "./Icons";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth } from "./main";
import { GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export function LoginPage () {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

    const loginWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        
        signInWithPopup(auth, provider)
            .then(() => navigate('/'))
            .catch((error) => console.error(error))
    }

    const login = () => {
        if(emailRef.current!.value !== null && passwordRef.current!.value !== null)
            signInWithEmailAndPassword(auth, emailRef.current!.value, passwordRef.current!.value)
                .then(()=>navigate('/'))
                .catch((error) => console.error(error));
    }

    const register = () => {
        if(emailRef.current!.value !== null && passwordRef.current!.value !== null)
            createUserWithEmailAndPassword(auth, emailRef.current!.value, passwordRef.current!.value)
                .then(()=>navigate('/'))
                .catch((error) => console.error(error));
    }

    return <>
        <div className="login-container">
            <div className="login-form-container">
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
                </div>
            </div>
        </div>
    </>
}