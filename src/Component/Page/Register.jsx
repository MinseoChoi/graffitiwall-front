import { useRef, useState } from 'react';
import styled from 'styled-components';
import { FileUploader } from 'react-drag-drop-files';
import { Button } from '../../utils/Button.js';
import { Image } from '../../utils/Image.js';
import { Title } from '../../utils/Title.js';
import { FormContainer } from '../../utils/FormContainer.js';
import { FormDiv } from '../../utils/FormDiv.js';
import { FormLabel } from '../../utils/FormLabel.js';
import { FormInput } from '../../utils/FormInput.js';

const Register = () => {
    // 이미지를 입력하지 않으면 -> 기본 이미지로?
    // 등록 버튼 클릭 시 동작 구현 필요
    // 코드 간소화 필요

    // 초기값 - 아이디, 닉네임, 비밀번호, 비밀번호 확인, 이메일, 이미지
    const [id, setId] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [email, setEmail] = useState('');
    const [image, setImage] = useState("");

    // 오류메시지 상태 지정
    const [idMessage, setIdMessage] = useState('');
    const [nicknameMessage, setNicknameMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [passwordConfirmMessage, setPasswordConfirmMessage] = useState('');
    const [emailMessage, setEmailMessage] = useState('');

    // 유효성 검사
    const [isId, setIsId] = useState(false);
    const [isNickname, setIsNickname] = useState(false);
    const [isPassword, setIsPassword] = useState(false);
    const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);
    const [isEmail, setIsEmail] = useState(false);

    const onChangeId = e => {
        const currentId = e.target.value;
        setId(currentId);
        const idRegExp = /^[a-zA-Z0-9]{4,12}$/;

        if (!idRegExp.test(currentId)) {
            setIdMessage("4-12 사이 대소문자 또는 숫자만 입력해주세요.");
            setIsId(false);
        } else {
            setIdMessage('사용가능한 아이디 입니다.');
            setIsId(true);
        }
    };

    const onChangeName = e => {
        const currentName = e.target.value;
        setNickname(currentName);

        if (currentName.length < 2 || currentName.length > 5) {
            setNicknameMessage("닉네임은 2글자 이상 5글자 이하로 입력해주세요.");
            setIsNickname(false);
        } else {
            setNicknameMessage("사용가능한 닉네임 입니다.");
            setIsNickname(true);
        }
    };

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

    const onChangeEmail = e => {
        const currentEmail = e.target.value;
        setEmail(currentEmail);
        const emailRegExp = /^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9]+[A-Za-z0-9]*[.]{1}[A-Za-z]{1,3}$/;

        if (!emailRegExp.test(currentEmail)) {
            setEmailMessage("이메일의 형식이 올바르지 않습니다.");
            setIsEmail(false);
        } else {
            setEmailMessage("사용 가능한 이메일 입니다.");
            setIsEmail(true);
        }
    };

    return (
        <div key="register" className="register">
            <Title>Register</Title>
            <FormContainer className="registerForm">
                <FormDiv>
                    <FormLabel>ID</FormLabel>
                    <FormDiv display='block' height='fit-content' marginBottom={-25}>
                        <FormInput className="idInput" type="text" name='id' onChange={onChangeId} />
                        <ErrorMessage className="message">{idMessage}</ErrorMessage>
                    </FormDiv>
                </FormDiv>
                <FormDiv>
                    <FormLabel>NickName</FormLabel>
                    <FormDiv display='block' height='fit-content' marginBottom={-25}>
                        <FormInput className="nickname" type="text" name="nickname" onChange={onChangeName} />
                        <ErrorMessage className="message">{nicknameMessage}</ErrorMessage>
                    </FormDiv>
                </FormDiv>
                <FormDiv>
                    <FormLabel>PW</FormLabel>
                    <FormDiv display='block' height='fit-content' marginBottom={-25}>
                        <FormInput className="password" type="password" name="password" onChange={onChangePassword} />
                        <ErrorMessage className="message">{passwordMessage}</ErrorMessage>
                    </FormDiv>
                </FormDiv>
                <FormDiv>
                    <FormLabel>Re PW</FormLabel>
                    <FormDiv display='block' height='fit-content' marginBottom={-25}>
                        <FormInput className="RePassword" type="password" name="RePassword" onChange={onChangePasswordConfirm} />
                        <ErrorMessage className="message">{passwordConfirmMessage}</ErrorMessage>
                    </FormDiv>
                </FormDiv>
                <FormDiv>
                    <FormLabel>Email</FormLabel>
                    <FormDiv display='block' height='fit-content' marginBottom={-25}>
                        <FormInput className="email" type="email" name="email" onChange={onChangeEmail} />
                        <ErrorMessage className="message">{emailMessage}</ErrorMessage>
                    </FormDiv>
                </FormDiv>
                <FormDiv>
                    <FormLabel>Profile Image</FormLabel>
                    <FormDiv padding='4px 6px' marginBottom={-25} width={50} className="profileImage">
                        {image ? (
                            <Image src={URL.createObjectURL(image)} onClick={() => setImage("")} />
                        ) : (
                            <FileUploader handleChange={(file) => setImage(file)} name="file" type="file" multiple={false} />
                        )}
                    </FormDiv>
                </FormDiv>
                <Button
                    onClick={() => alert('회원가입이 완료되었습니다.')}
                    disabled={
                        isId === true &&
                        isNickname === true &&
                        isPassword === true &&
                        isPasswordConfirm === true &&
                        isEmail === true
                            ? false
                            : true
                    }
                >Register</Button>
            </FormContainer>
        </div>
    );
};

export default Register;

const ErrorMessage = styled.p`
    color: red;
    font-size: 12px;
`;