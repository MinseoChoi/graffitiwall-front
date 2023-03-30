import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LoginForm = ({ closeSidebar }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        closeSidebar('');
        navigate("/register");
    };

    return (
        <LoginContainer className="loginForm">
            <LoginTitle>Log In</LoginTitle>
            <LoginInput type="text" className="ID" placeholder="ID" /><br/>
            <LoginInput type="password" className="Password" placeholder="PASSWORD" /><br/>
            <LoginButton className="loginbutton">Log in</LoginButton>
            <LoginButton className="registerbutton" onClick={handleClick}>Register</LoginButton>
        </LoginContainer>
    );
};

export default LoginForm;

const LoginContainer = styled.form`
    position: absolute;
    display:inline-block;
    justify-content: center;
    align-items: center;
    top: 8%;
    right: 34px;
`;

const LoginTitle = styled.p`
    font-size: 25px;
    font-weight: bold;
    text-align: center;
`;

const LoginInput = styled.input`
    display: block;
    padding: 4px 6px;
    width: 180px;
    height: 15px;
    font-size: 13px;
    border-radius: 5px;
    border-color: transparent;
`;

const LoginButton = styled.button`
    width: 80px;
    height: 25px;
    margin-left: 12px;
    border-color: transparent;
    border-radius: 5px;
    background-color: white;
    font-size: 12px;
    font-weight: bold;
    box-sizing: border-box;
    cursor: pointer;

    &:hover {
        outline-color: transparent;
        outline-style: bold;
        box-shadow: 0 0 0 1px black;
        border: none;
        color: white;
        background-color: black;
    }
`;