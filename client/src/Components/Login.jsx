import './Styles/AccessOptions.css';
import { GoogleLogin } from '@react-oauth/google';
import { useContext } from "react";
import AuthContext from "../Context/AuthContext";
import NavBar from './NavBar';


function Login(props) {
    const auth = useContext(AuthContext);
    
    async function handleLogin(googleData) {
        const res = await fetch("/authentication/auth", {
            method: "POST",
            body: JSON.stringify({ token: googleData.credential }),
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
        });
        console.log(res.status)
        const data = await res.json();
        await setUserData(data)
    }

    async function setUserData(data) {
        await fetch("/api/user", {
            method: "POST",
            body: JSON.stringify({
                username: data.user.username,
                email: data.user.email,
                "picture_url": data.user.pic,
            }),
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json",
            },
        });

        auth.setUserEmail(data.user.email);
    }

    return (
        <>
            {props.navbar ? <NavBar /> : null}
            <div className="access">
                <h2>Login</h2>
                <GoogleLogin
                    onSuccess={handleLogin}
                    onError={() => console.log('Login Failed')} />
            </div>
        </>
    );
}

export default Login;