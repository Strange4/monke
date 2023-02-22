import './Styles/Login.css';
import { GoogleLogin } from '@react-oauth/google';
import { useState } from "react";

function Login() {

    const [username, setUsername] = useState("");

    const handleLogin = async googleData => {
        const res = await fetch("authentication/auth", {
            method: "POST",
            body: JSON.stringify({
                token: googleData.credential
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json()
        setUsername(data.user.name);
    }

    const protectedRoute = async () => {
        const response = await fetch("/authentication/protected");
        if (response.status === 200) {
            // eslint-disable-next-line no-alert
            alert("You are authorized to see this!");
        } else if (response.status === 401) {
            // eslint-disable-next-line no-alert
            alert("You are not authorized to see this!");
        } else {
            // eslint-disable-next-line no-alert
            alert("Something went wrong!");
        }
    }

    const handleLogout = async () => {
        await fetch("/authentication/logout");
        setUsername("");
    }

    return (
        <div id="login">
            <h1>Login Popup</h1>
            <h2>Welcome {username ? username : "Anonymous"}</h2>
            {!username && <GoogleLogin
                onSuccess={handleLogin}
                onError={() => {
                    console.log('Login Failed');
                }} />}
            {username && <button onClick={handleLogout}>Logout</button>}
            <button onClick={protectedRoute}>Test protected</button>
        </div>
    );
}

export default Login;