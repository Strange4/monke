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
        auth.setUserEmail(data.user.email);
    }

    return (
        <>
            {props.navbar ? <NavBar /> : null}
            <div id="login">
                <h1>Login Popup</h1>
                <h2>Welcome {auth.checkAccess() ? "TEST" : "Anonymous"}</h2>
                <GoogleLogin
                    onSuccess={handleLogin}
                    onError={() => console.log('Login Failed')} />
            </div>
        </>
    );
}

export default Login;