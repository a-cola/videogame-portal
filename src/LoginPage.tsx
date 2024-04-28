import { GoogleIcon } from "./Icons";

export function LoginPage () {
    return <>
        <div className="login-container">
            <div className="login-form-container">
                <div className="login-form">
                    <img src="./VGP_Logo.png" />
                    <input type="text" placeholder="Insert e-mail"/>
                    <input type="password" placeholder="Insert password"/>
                    <div className="login-register-buttons">
                        <button type="button" className="sign-in-button">Sign in</button>
                        <button type="button" className="register-button">Register</button>
                    </div>
                    <button type="button" className="google-button">
                        <span>Sign in with Google</span>
                        <GoogleIcon />
                    </button>
                </div>
            </div>
        </div>
    </>
}