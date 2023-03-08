import './Styles/AccessOptions.css';
import { GoogleLogin } from '@react-oauth/google';
import { useContext } from "react";
import AuthContext from "../Context/AuthContext";
import NavBar from './NavBar';
import { postData } from '../Controller/FetchModule';


function Login(props) {
    const auth = useContext(AuthContext);

    async function handleLogin(googleData) {
        let data = await postData("/authentication/login", {token: googleData.credential}, "POST")
        await setUserData(data)
    }

    async function setUserData(data) {
        let userData = {
            username: data.user.username,
            email: data.user.email,
            "picture_url": data.user.pic,
        }
        await postData("/api/user", userData, "POST")
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