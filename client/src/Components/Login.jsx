import './Styles/Login.css';
import { GoogleLogin } from '@react-oauth/google';

function Login() {

    const handleLogin = async googleData => {
        const res = await fetch("/auth", {
            method: "POST",
            body: JSON.stringify({
                token: googleData.credential
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json()
        // we will come back to this, since our server will be replying with our info
    }

    const handleError = error => {
        console.error(error);
    }

    return (
        <div id="login">
            <h1>Login Popup</h1>
            <GoogleLogin
                onSuccess={handleLogin}
                onError={handleError}
            />
        </div>
    );
}

export default Login;