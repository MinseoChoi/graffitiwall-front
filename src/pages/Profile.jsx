import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { request } from '../utils/api';
import { Button, Title, FormContainer, FormDiv, FormLabel, FormInput, Image } from '../components/common';
import userImage from '../assets/user.svg';

const Profile = () => {
    // 프로필 img로 변경 필요
    const [user, setUser] = useState({
        id: 1,
        userId: '',
        password: null,
        email: '',
        imageUrl: null,
        introduce: '',
        status: 'ACTIVE'
    });

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [reNewPassword, setReNewPassword] = useState('');

    const [passwordMessage, setPasswordMessage] = useState('');
    const [passwordConfirmMessage, setPasswordConfirmMessage] = useState('');

    const [isPassword, setIsPassword] = useState(false);
    const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);

    // GET 메소드로 유저 정보 가져오기
    useEffect(() => {
        const getUser = async () => {
            await request('/users/1')
            .then(json => {
                setUser(json);
            })
        };
        getUser();
    }, []);

    const changeUserValue = e => {
        const { name, value } = e.target;

        if (name === 'currentPassword') {
            setCurrentPassword(value);
        } else if (name === 'newPassword') {
            setNewPassword(value);
            onChangePassword(value);
        } else if (name === 'reNewPassword') {
            setReNewPassword(value);
            onChangePasswordConfirm(value);
        } else {
            setUser({
                ...user,
                [name]: value
            });
        }
    };

    const onChangePassword = value => {
        const passwordRegExp = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
        if (!passwordRegExp.test(value)) {
            setPasswordMessage("숫자 + 영문자 + 특수문자 조합으로 8자리 이상 입력해주세요.");
            setIsPassword(false);
        } else {
            setPasswordMessage("안전한 비밀번호 입니다.");
            setIsPassword(true);
        }
    };

    const onChangePasswordConfirm = value => {
        if (newPassword !== value) {
            setPasswordConfirmMessage("비밀번호가 일치하지 않습니다,");
            setIsPasswordConfirm(false);
        } else {
            setPasswordConfirmMessage("비밀번호가 일치합니다.");
            setIsPasswordConfirm(true);
        }
    };

    const editUser = async e => {
        e.preventDefault();

        if (!currentPassword && !newPassword) {
            return;
        }

        if (currentPassword !== user.password) {
            alert('현재 비밀번호와 일치하지 않습니다. 다시 입력해주세요.');
            return;
        } else if (currentPassword === newPassword) {
            alert('현재 비밀번호와 동일한 비밀번호 입니다. 새로운 비밀번호를 입력해주세요.');
            return;
        } else if (newPassword !== reNewPassword) {
            alert('새로운 비밀번호가 일치하지 않습니다. 동일하게 입력해주세요.');
            return;
        } else {
            await request('/users/1', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...user,
                    password: newPassword
                })
            })
            .then(json => alert('프로필이 수정되었습니다.'));
        }
    };

    return (
        <div key="profile">
            <Title>My Profile</Title>
            <FormSpace>
                <FormContainer>
                    <FormDiv marginBottom={30}>
                        <FormLabel>Profile Image</FormLabel>
                        <FormDiv padding='4px 6px' marginBottom={-25} width={50}>
                            {user.imageUrl ? (
                                <div>
                                    <Image src={URL.createObjectURL(user.imageUrl)} alt='프로필 이미지' />
                                    <DeleteImageButton type='button' onClick={() => setUser({ ...user, imageUrl: "" })}>✕</DeleteImageButton>
                                </div>
                            ) : (
                                <FileUploader handleChange={(file) => setUser({ ...user, imageUrl: file})} name="file" type="file" multiple={false} />
                            )}
                        </FormDiv>
                    </FormDiv>
                    <FormDiv marginBottom={25}>
                        <FormLabel>NickName</FormLabel>
                        <FormInput type="text" name="userId" value={user.userId} onChange={changeUserValue} />
                    </FormDiv>
                    <FormDiv marginBottom={25}>
                        <FormLabel>Current PW</FormLabel>
                        <FormInput type="password" name="currentPassword" onChange={changeUserValue} />
                    </FormDiv>
                    <FormDiv marginBottom={25}>
                        <FormLabel>New PW</FormLabel>
                        <FormDiv display='block' height='fit-content' marginBottom={-25}>
                            <FormInput type="password" name="newPassword" onChange={changeUserValue} />
                            <ErrorMessage>{passwordMessage}</ErrorMessage>
                        </FormDiv>
                    </FormDiv>
                    <FormDiv marginBottom={25}>
                        <FormLabel>Re New PW</FormLabel>
                        <FormDiv display='block' height='fit-content' marginBottom={-25}>
                            <FormInput type="password" name="reNewPassword" onChange={changeUserValue} />
                            <ErrorMessage>{passwordConfirmMessage}</ErrorMessage>
                        </FormDiv>
                    </FormDiv>
                    <FormDiv marginBottom={25}>
                        <FormLabel>Email</FormLabel>
                        <FormInput type="email" name="email" value={user.email} onChange={changeUserValue} />
                    </FormDiv>
                    <FormDiv marginBottom={-30}>
                        <FormLabel>Introduce</FormLabel>
                        <FormTextarea name='introduce' value={user.introduce} placeholder='유저들에게 자신을 소개해보세요!' onChange={changeUserValue}></FormTextarea>
                    </FormDiv>
                    <Button bottom={-80} right={153} onClick={editUser}>Edit</Button>
                </FormContainer>
            </FormSpace>
        </div>
    );
};

export default Profile;

const FormSpace = styled.div`
    position: absolute;
    top: 180px;
    left: 100px;
    width: 80%;
    height: 70vh;
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

const ErrorMessage = styled.p`
    color: red;
    font-size: 12px;
`;

const FormTextarea = styled.textarea`
    margin: 0 auto;
    padding: 4px 6px;
    width: 50vw;
    height: 100px;
    font-size: 13px;
    border: 1px solid black;
    border-radius: 5px;
    vertical-align: top;
`;