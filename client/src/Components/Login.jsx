import './Styles/Login.css';
import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <div id="login">
            <h1>Login Popup</h1>
            <Link to="/profile" id="login-btn">Google Login Button</Link>
        </div>
    );
};

export default Login;