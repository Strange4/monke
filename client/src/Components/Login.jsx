import './Styles/AccessOptions.css';
import { GoogleLogin } from '@react-oauth/google';
import { useContext } from "react";
import AuthContext from "../Context/AuthContext";
import NavBar from './NavBar';
import { postData } from '../Controller/FetchModule';


function Login(props) {
    const auth = useContext(AuthContext);

    async function handleLogin(googleData) {
        const data =
            await postData("/authentication/login", { token: googleData.credential }, "POST");
        if (data) {
            const userSet = await setUserData(data);
            if (userSet) {
                auth.setUserLoggedIn(true);
            }
        }
    }

    async function setUserData(data) {
        if (data) {
            const userData = {
                username: data.user.username,
                "picture_url": data.user.pic,
            }
            await postData("/api/user", userData, "POST");
            return true;
        }
        return false;
    }

    return (
        <>
            {props.navbar ? <NavBar /> : null}
            <div className="access">
                <GoogleLogin
                    onSuccess={handleLogin}
                    onError={() => console.log('Login Failed')} />
            </div>
        </>
    );
}

export default Login;