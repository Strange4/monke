import './Styles/Login.css';
import { GoogleLogin } from '@react-oauth/google';
import { useState } from "react";
import Profile from '../Pages/Profile';

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

    // const checkAccess = async () => {
    //     const response = await fetch("/authentication/protected");
    //     if (response.status === 200) {
    //         console.log("true")
    //         return true
    //     } else if (response.status === 401) {
    //         console.log("false")
    //         return false
    //     } else {
    //         console.log("error")
    //         return false
    //     }
    // }

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
            {username && <Profile handleLogout={handleLogout}/>}
        </div>
    );
}

export default Login;