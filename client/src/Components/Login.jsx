import './Styles/Login.css';
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
            headers: { 'Accept': 'application/json', "Content-Type": "application/json" },
        });
        const data = await res.json();

        await setUserData(data)
    }

    async function setUserData(data) {
        console.log(data)
        const res = await fetch("/api/user", {
            method: "POST",
            body: JSON.stringify({
                "user": {
                    "username": data.user.username,
                    "pic": data.user.pic,
                    "email": data.user.email
                }
            }),
            headers: { 'Accept': 'application/json', "Content-Type": "application/json" },
        });

        console.log(res)

        auth.setUserEmail(data.user.email);
    }

    return (
        <>
            {props.navbar ? <NavBar /> : null}
            <div id="login">
                <h1>Login Popup</h1>
                <h2>Welcome</h2>
                <GoogleLogin
                    onSuccess={handleLogin}
                    onError={() => console.log('Login Failed')} />
            </div>
        </>
    );
}

export default Login;