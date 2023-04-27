import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate  } from 'react-router-dom';
import { FileUploader } from 'react-drag-drop-files';
import { request } from '../utils/api';
import { Button, Title, FormContainer, FormDiv, FormLabel, FormInput, Image } from '../components/common';

/* 회원가입 페이지 */
const Register = () => {
    // 이미지를 입력하지 않으면 -> 기본 이미지로?

    // 초기값 - 아이디, 닉네임, 비밀번호, 비밀번호 확인, 이메일, 이미지
    const [userId, setUserId] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [email, setEmail] = useState('');
    const [image, setImage] = useState('');

    // 오류메시지 상태 지정
    const [userIdMessage, setUserIdMessage] = useState('');
    const [nicknameMessage, setNicknameMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [passwordConfirmMessage, setPasswordConfirmMessage] = useState('');
    const [emailMessage, setEmailMessage] = useState('');

    // 유효성 검사
    const [isUserId, setIsUserId] = useState(false);
    const [isNickname, setIsNickname] = useState(false);
    const [isPassword, setIsPassword] = useState(false);
    const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);
    const [isEmail, setIsEmail] = useState(false);

    // ID 검사
    const onChangeUserId = e => {
        const currentUserId = e.target.value;
        setUserId(currentUserId);
        const idRegExp = /^(?=.*[a-zA-Z])(?=.*[0-9]).{4,12}$/;

        if (!idRegExp.test(currentUserId)) {
            setUserIdMessage("4-12 사이 대소문자 또는 숫자만 입력해주세요.");
            setIsUserId(false);
        } else {
            setUserIdMessage('사용가능한 아이디 입니다.');
            setIsUserId(true);
        }
    };
    
    const [userIdResult, setUserIdResult] = useState(false);
    const [nicknameResult, setNicknameResult] = useState(false);

    const isExistUserId = async () => {
        await request(`/users/userid/${userId}/duplicate`)
        .then(json => json.idExist === false ? setUserIdResult(false) : setUserIdResult(true)
        )

        if (userIdResult) {
            setUserIdMessage("이미 존재하는 아이디 입니다.");
            setIsUserId(false);
        } else {
            setUserIdMessage("사용가능한 아이디 입니다.");
            setIsUserId(true);   
        }
    };

    // 닉네임 중복 체크 함수
    const isExistNickname = async () => {
        await request(`/users/nickname/${nickname}/duplicate`)
        .then(json => 
            json.nicknameExist === false ? setNicknameResult(false) : setNicknameResult(true)
        )

        if (nicknameResult) {
            setNicknameMessage("이미 존재하는 닉네임 입니다.");
            setIsNickname(false);
        } else {
            setNicknameMessage("사용가능한 닉네임 입니다.");
            setIsNickname(true);   
        }
    };

    // 닉네임 검사
    const onChangeNickname = e => {
        const currentNickName = e.target.value;
        setNickname(currentNickName);

        if (currentNickName.length < 2 || currentNickName.length > 10) {
            setNicknameMessage("닉네임은 2글자 이상 10글자 이하로 입력해주세요.");
            setIsNickname(false);
        } else {
            setNicknameMessage("사용가능한 닉네임 입니다.");
            setIsNickname(true);
        }
    };

    // 비밀번호 검사
    const onChangePassword = e => {
        const currentPassword = e.target.value;
        setPassword(currentPassword);
        const passwordRegExp = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
        if (!passwordRegExp.test(currentPassword)) {
            setPasswordMessage("숫자 + 영문자 + 특수문자 조합으로 8자리 이상 입력해주세요.");
            setIsPassword(false);
        } else {
            setPasswordMessage("안전한 비밀번호 입니다.");
            setIsPassword(true);
        }
    };

    // 비밀번호 확인 검사
    const onChangePasswordConfirm = e => {
        const currentPasswordConfirm = e.target.value;
        setPasswordConfirm(currentPasswordConfirm);
        if (password !== currentPasswordConfirm) {
            setPasswordConfirmMessage("비밀번호가 일치하지 않습니다,");
            setIsPasswordConfirm(false);
        } else {
            setPasswordConfirmMessage("비밀번호가 일치합니다.");
            setIsPasswordConfirm(true);
        }
    };

    // 이메일 검사
    const onChangeEmail = e => {
        const currentEmail = e.target.value;
        setEmail(currentEmail);
        const emailRegExp = /^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9]+[A-Za-z0-9]*[.]{1}[A-Za-z]{1,3}$/;

        if (!emailRegExp.test(currentEmail)) {
            setEmailMessage("이메일의 형식이 올바르지 않습니다.");
            setIsEmail(false);
        } else {
            setEmailMessage("사용가능한 이메일 입니다.");
            setIsEmail(true);
        }
    };

    // 버튼 클릭 시, POST 메소드로 유저 정보 DB에 저장
    const register = async e => {
        e.preventDefault();

        await request('/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                nickname: nickname,
                password: password,
                email: email,
                imageUrl: null,
                introduce: ''
            })
        })
        .then(json => alert('회원가입이 완료되었습니다.'));

        handleClick();
    };

    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/');
    };

    return (
        <div key="register" className="register">
            <Title>Register</Title>
            <FormSpace>
                <FormContainer>
                    <FormDiv>
                        <FormLabel fontSize='14px'>ID</FormLabel>
                        <FormDiv display='block' height='fit-content' marginTop='1px' marginBottom={-30}>
                            <FormInput top='-6px' type="text" name='userId' onChange={onChangeUserId} />
                            <FormDiv marginBottom={5} style={{ justifyContent: 'space-between' }}>
                                <ErrorMessage>{userIdMessage}</ErrorMessage>
                                <DuplicateCheckButton type='button' onClick={isExistUserId}>중복 확인</DuplicateCheckButton>
                            </FormDiv>
                        </FormDiv>
                    </FormDiv>
                    <FormDiv>
                        <FormLabel fontSize='14px'>NickName</FormLabel>
                        <FormDiv display='block' height='fit-content' marginTop='1px' marginBottom={-30}>
                            <FormInput top='-6px' type="text" name="nickname" onChange={onChangeNickname} />
                            <FormDiv marginBottom={5} style={{ justifyContent: 'space-between' }}>
                                <ErrorMessage>{nicknameMessage}</ErrorMessage>
                                <DuplicateCheckButton type='button' onClick={isExistNickname}>중복 확인</DuplicateCheckButton>
                            </FormDiv>
                        </FormDiv>
                    </FormDiv>
                    <FormDiv>
                        <FormLabel fontSize='14px'>PW</FormLabel>
                        <FormDiv display='block' height='fit-content' marginTop='1px' marginBottom={-40}>
                            <FormInput top='-6px' type="password" name="password" onChange={onChangePassword} />
                            <ErrorMessage>{passwordMessage}</ErrorMessage>
                        </FormDiv>
                    </FormDiv>
                    <FormDiv>
                        <FormLabel fontSize='14px'>Re PW</FormLabel>
                        <FormDiv display='block' height='fit-content' marginTop='1px' marginBottom={-40}>
                            <FormInput top='-6px' type="password" name="RePassword" onChange={onChangePasswordConfirm} />
                            <ErrorMessage>{passwordConfirmMessage}</ErrorMessage>
                        </FormDiv>
                    </FormDiv>
                    <FormDiv>
                        <FormLabel fontSize='14px'>Email</FormLabel>
                        <FormDiv display='block' height='fit-content' marginTop='1px' marginBottom={-40}>
                            <FormInput top='-6px' type="email" name="email" onChange={onChangeEmail} />
                            <ErrorMessage>{emailMessage}</ErrorMessage>
                        </FormDiv>
                    </FormDiv>
                    <FormDiv>
                        <FormLabel fontSize='14px'>Profile Image</FormLabel>
                        <FormDiv padding='4px 6px' marginBottom={-50} width={50}>
                            {image ? (
                                <div style={{ position: 'relative', marginBottom: '-60px'}}>
                                    <Image src={URL.createObjectURL(image)} alt='프로필 이미지' />
                                    <DeleteImageButton type='button' onClick={() => setImage("")}>✕</DeleteImageButton>
                                </div>
                            ) : (
                                <FileUploader handleChange={(file) => setImage(file)} name="file" types={["JPG", "PNG", "JPEG", "SVG"]} multiple={false} />
                            )}
                        </FormDiv>
                    </FormDiv>
                    <FormDiv>
                        <Button
                            right={150}
                            onClick={register}
                            disabled={
                                isUserId === true &&
                                isNickname === true &&
                                isPassword === true &&
                                isPasswordConfirm === true &&
                                isEmail === true
                                    ? false
                                    : true
                            }
                        >Register
                    </Button>
                    </FormDiv>
                </FormContainer>
            </FormSpace>
        </div>
    );
};

export default Register;

const FormSpace = styled.div`
    position: absolute;
    top: 200px;
    left: 100px;
    width: 80%;
    height: 70vh;
`;

const DuplicateCheckButton = styled.button`
    position: relative;
    top: 5px;
    height: 3vh;
    background-color: white;
    border: 1px solid gray;
    border-radius: 5px;

    &:hover {
        cursor: pointer;
    }
`;

const ErrorMessage = styled.p`
    position: relative;
    top: -8px;
    left: 6px;
    color: red;
    font-size: 12px;
`;

const DeleteImageButton = styled.button`
    display: flex;
    position: relative;
    top: -97px;
    left: 85px;
    width: 23px;
    height: 23px;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    border: none;
    border-radius: 50%;
    background-color: transparent;

    &:hover {
        cursor: pointer;
        outline-color: transparent;
        outline-style: solid;
        box-shadow: 0 0 0 1px lightgray;
    }
`;