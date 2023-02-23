import './Styles/Login.css';
import { GoogleLogin } from '@react-oauth/google';
import { useContext } from "react";
import AuthContext from "../Context/AuthContext";
import NavBar from './NavBar';
// import NavBar from './NavBar';

function Login(props) {

    const auth = useContext(AuthContext);

    async function handleLogin(googleData) {
        console.log("here")
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
        auth.setUserData(data.user)
        auth.setLoginStatus(true)
    }

    return (
        <>
            {props.navbar ? <NavBar /> : null}
            <div id="login">

                <h1>Login Popup</h1>
                <h2>Welcome {auth.checkAccess() ? auth.user.username : "Anonymous"}</h2>
                <GoogleLogin
                    onSuccess={handleLogin}
                    onError={() => console.log('Login Failed')} />
            </div>
        </>

    );
}

export default Login;