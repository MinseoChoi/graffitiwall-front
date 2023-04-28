import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

/* 사이드바 - 로그인 */
const LoginForm = ({ login, closeSidebar }) => {
    // 동작 구현 필요
    const [user, setUser] = useState({
        userId: '',
        password: ''
    });

    const changeValue = e => {
        const { name, value } = e.target;

        setUser({
            ...user,
            [name]: value
        })
    };

    // 회원가입 버튼 클릭 시, 회원가입 페이지로 라우팅
    const navigate = useNavigate();
    const handleClick = () => {
        closeSidebar('');
        navigate("/register");
    };

    const signIn = e => {
        e.preventDefault();

        if (user.userId === '' || user.password === '') {
            return alert('아이디 또는 비밀번호를 입력해주세요.');
        } else {
            login(user);
        }
    };

    return (
        <LoginContainer>
            <LoginTitle>Log In</LoginTitle>
            <LoginInput type="text" name="userId"  placeholder="ID" onChange={changeValue} /><br/>
            <LoginInput type="password" name="password" placeholder="PASSWORD" onChange={changeValue} /><br/>
            <LoginButton onClick={signIn}>Sign in</LoginButton>
            <LoginButton onClick={handleClick}>Register</LoginButton>
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