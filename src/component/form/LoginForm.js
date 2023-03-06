import './LoginForm.css';

const LoginForm = () => {
    return (
        <form className="login-form">
            <p>Log In</p>
            <input type="text" className="ID" placeholder="ID" /><br/>
            <input type="password" className="Password" placeholder="PASSWORD" /><br/>
            <button className="loginbutton">Log in</button>
            <button className="registerbutton">Register</button>
        </form>
    );
};

export default LoginForm;