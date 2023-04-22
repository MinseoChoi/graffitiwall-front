import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { request } from '../utils/api';
import { Button, Title, FormContainer, FormDiv, FormLabel, FormInput, Image } from '../components/common';
import userImage from '../assets/user.svg';

/* 프로필 페이지 */
const Profile = () => {
    // 닉네임 중복 체크 필요
    // 프로필 img로 변경 필요
    // 유저 정보
    const [user, setUser] = useState({
        id: 1,
        userId: '',
        password: null,
        email: '',
        imageUrl: null,
        introduce: '',
        nickname: '',
        status: 'ACTIVE'
    });

    const [userNicknameList, setUserNicknameList] = useState([]);

    useEffect(() => {
        const getuserNickname = async () => {
            await request('/users')
            .then(json => {
                setUserNicknameList(json.nickname);
            })
        };
        // getuserNickname();
    }, []);

    // 현재 비밀번호 / 새 비밀번호 / 새 비밀번호 확인
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [reNewPassword, setReNewPassword] = useState('');

    // 오류메시지 상태 지정
    const [nicknameMessage, setNicknameMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [passwordConfirmMessage, setPasswordConfirmMessage] = useState('');
    const [emailMessage, setEmailMessage] = useState('');

    // 유효성 검사
    const [isNickname, setIsNickname] = useState(true);
    const [isPassword, setIsPassword] = useState(true);
    const [isPasswordConfirm, setIsPasswordConfirm] = useState(true);
    const [isEmail, setIsEmail] = useState(true);

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

    // 유저 정보가 바뀔 때마다 set
    const changeUserValue = e => {
        const { name, value } = e.target;

        // 유효성 검사
        if (name === 'nickname') {
            setUser({
                ...user,
                nickname: value
            });
            onChangeNickname(value);
        } else if (name === 'currentPassword') {
            setCurrentPassword(value);
        } else if (name === 'newPassword') {
            setNewPassword(value);
            onChangePassword(value);
        } else if (name === 'reNewPassword') {
            setReNewPassword(value);
            onChangePasswordConfirm(value);
        } else if (name === 'email') {
            setUser({
                ...user,
                email: value
            })
            onChangeEmail(value);
        } else {
            setUser({
                ...user,
                [name]: value
            });
        }
    };

    // 닉네임 중복 체크 함수
    const isExist = (name) => {
        const data = userNicknameList.filter(data => data === name);
        if (!data.length) {
            return false
        } else {
            return true
        }
    };

    // 닉네임 검사
    const onChangeNickname = value => {
        if (isExist(value)) {
            setNicknameMessage("이미 존재하는 닉네임 입니다.");
            setIsNickname(false);
        } else if (value.length < 2 || value.length > 20) {
            setNicknameMessage("게시판 이름은 2글자 이상 20글자 이하로 입력해주세요.");
            setIsNickname(false);
        } else {
            setNicknameMessage("사용가능한 이름 입니다.");
            setIsNickname(true);
        }
    };

    // 새 비밀번호 검사
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

    // 새 비밀번호 확인 검사
    const onChangePasswordConfirm = value => {
        if (newPassword !== value) {
            setPasswordConfirmMessage("비밀번호가 일치하지 않습니다,");
            setIsPasswordConfirm(false);
        } else {
            setPasswordConfirmMessage("비밀번호가 일치합니다.");
            setIsPasswordConfirm(true);
        }
    };

    // 이메일 검사
    const onChangeEmail = value => {
        const emailRegExp = /^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9]+[A-Za-z0-9]*[.]{1}[A-Za-z]{1,3}$/;

        if (!emailRegExp.test(value)) {
            setEmailMessage("이메일의 형식이 올바르지 않습니다.");
            setIsEmail(false);
        } else {
            setEmailMessage("사용가능한 이메일 입니다.");
            setIsEmail(true);
        }
    };

    // 버튼 클릭 시
    const editUser = async e => {
        e.preventDefault();

        // 수정 필요 - 변경사항이 아예 없는 경우
        if (!currentPassword && !newPassword) {
            alert('변경사항이 없습니다.');
            return;
        }

        // 예외 처리
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
                    <FormDiv>
                        <FormLabel fontSize='14px'>Profile Image</FormLabel>
                        <FormDiv padding='4px 6px' marginBottom={-20} width={50}>
                            {user.imageUrl ? (
                                <div style={{ position: 'relative', marginBottom: '-30px' }}>
                                    <Image src={URL.createObjectURL(user.imageUrl)} alt='프로필 이미지' />
                                    <DeleteImageButton type='button' onClick={() => setUser({ ...user, imageUrl: "" })}>✕</DeleteImageButton>
                                </div>
                            ) : (
                                <FileUploader handleChange={(file) => setUser({ ...user, imageUrl: file})} name="file" types={["JPG", "PNG", "JPEG", "SVG"]} multiple={false} />
                            )}
                        </FormDiv>
                    </FormDiv>
                    <FormDiv marginBottom={42}>
                        <FormLabel fontSize='14px'>NickName</FormLabel>
                        <FormDiv display='block' height='fit-content' marginTop='1px' marginBottom={-40}>
                            <FormInput type="text" name="nickname" value={user.nickname} onChange={changeUserValue} />
                            <ErrorMessage>{nicknameMessage}</ErrorMessage>
                        </FormDiv>
                    </FormDiv>
                    <FormDiv marginBottom={20}>
                        <FormLabel fontSize='14px'>Current PW</FormLabel>
                        <FormInput type="password" name="currentPassword" onChange={changeUserValue} />
                    </FormDiv>
                    <FormDiv marginBottom={42}>
                        <FormLabel fontSize='14px'>New PW</FormLabel>
                        <FormDiv display='block' marginTop='-2px' height='fit-content' marginBottom={-25}>
                            <FormInput type="password" name="newPassword" onChange={changeUserValue} />
                            <ErrorMessage>{passwordMessage}</ErrorMessage>
                        </FormDiv>
                    </FormDiv>
                    <FormDiv marginBottom={42}>
                        <FormLabel fontSize='14px'>Re New PW</FormLabel>
                        <FormDiv display='block' marginTop='-2px' height='fit-content' marginBottom={-25}>
                            <FormInput type="password" name="reNewPassword" onChange={changeUserValue} />
                            <ErrorMessage>{passwordConfirmMessage}</ErrorMessage>
                        </FormDiv>
                    </FormDiv>
                    <FormDiv marginBottom={42}>
                        <FormLabel fontSize='14px'>Email</FormLabel>
                        <FormDiv display='block' marginTop='-2px' height='fit-content' marginBottom={-25}>
                            <FormInput type="email" name="email" value={user.email} onChange={changeUserValue} />
                            <ErrorMessage>{emailMessage}</ErrorMessage>
                        </FormDiv>
                    </FormDiv>
                    <FormDiv marginBottom={-30}>
                        <FormLabel fontSize='14px'>Introduce</FormLabel>
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
    position: relative;
    margin-bottom: -5px;
    top: -6px;
    left: 2px;
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