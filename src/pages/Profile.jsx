import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { request } from '../utils/api';
import { Button, Title, FormContainer, FormDiv, FormLabel, FormInput, Image } from '../components/common';
import { UserDeleteModal } from '../components/Modal';
import { useNavigate } from 'react-router-dom';

/* 프로필 페이지 */
const Profile = () => {
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

    let sessionStorage = window.sessionStorage;

    // GET 메소드로 유저 정보 가져오기
    useEffect(() => {
        const sessionSearch = sessionStorage.getItem('userRawId')
        
        const getUser = async () => {
            await request(`/users/${sessionSearch}`)
            .then(json => {
                setUser(json);
                setCurrentPassword(json.password);
            })
        };

        if (sessionSearch) getUser();
        else alert('로그인이 필요한 서비스입니다.');
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

    const [result, setResult] = useState(false);

    // 닉네임 중복 체크 함수
    const isExist = async () => {
        await request(`/users/nickname/${user.nickname}/duplicate`)
        .then(json => 
            json.nicknameExist === false ? setResult(false) : setResult(true)
        )

        if (result) {
            setNicknameMessage("이미 존재하는 닉네임 입니다.");
            setIsNickname(false);
        } else {
            setNicknameMessage("사용가능한 닉네임 입니다.");
            setIsNickname(true);   
        }
    };

    // 닉네임 검사
    const onChangeNickname = () => {
        const nickname = user.nickname;

        if (nickname.length < 2 || nickname.length > 10) {
            setNicknameMessage("닉네임은 2글자 이상 10글자 이하로 입력해주세요.");
            setIsNickname(false);
        } else {
            setNicknameMessage("사용가능한 닉네임 입니다.");
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
            await request(`/users/${user.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...user,
                    password: newPassword
                })
            })
            .then(json => {
                alert('프로필이 수정되었습니다.');
            });
        }
    };

    /* ------ 모달 창 ------ */
    // 모달 창 state(open/close)
    const [modal, setModal] = useState(false);

    // 모달 창 state 변경 함수
    const openModal = () => setModal(true);
    const closeModal = () => setModal(false);

    const onDelete = async () => {
        closeModal();
        
        await request(`/users/${user.id}`, {
            method: 'DELETE'
        })
        .then(json => {
            alert('정상적으로 탈퇴가 되었습니다.');
            sessionStorage.removeItem('userRawId');
        });
        handleClick();
    };

    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/');
    };

    return (
        <div key="profile">
            <Title>My Profile</Title>
            <FormSpace>
                <FormContainer>
                    <FormDiv>
                        <FormLabel fontSize='14px'>Profile Image</FormLabel>
                        <FormDiv padding='4px 6px' marginBottom={-26} width={50}>
                            {user.imageUrl ? (
                                <div style={{ position: 'relative', marginBottom: '-45px' }}>
                                    <Image src={URL.createObjectURL(user.imageUrl)} alt='프로필 이미지' />
                                    <DeleteImageButton type='button' onClick={() => setUser({ ...user, imageUrl: "" })}>✕</DeleteImageButton>
                                </div>
                            ) : (
                                <FileUploader handleChange={(file) => setUser({ ...user, imageUrl: file })} name="file" types={["JPG", "PNG", "JPEG", "SVG"]} multiple={false} />
                            )}
                        </FormDiv>
                    </FormDiv>
                    <FormDiv marginBottom={42}>
                        <FormLabel fontSize='14px'>NickName</FormLabel>
                        <FormDiv display='block' height='fit-content' marginTop='1px' marginBottom={-40}>
                            <FormInput type="text" name="nickname" value={user.nickname} onChange={changeUserValue} />
                            <FormDiv marginBottom={15} style={{ justifyContent: 'space-between' }}>
                                <ErrorMessage>{nicknameMessage}</ErrorMessage>
                                <DuplicateCheckButton type='button' onClick={isExist}>중복 확인</DuplicateCheckButton>
                            </FormDiv>
                        </FormDiv>
                    </FormDiv>
                    <FormDiv marginBottom={20}>
                        <FormLabel fontSize='14px'>Current PW</FormLabel>
                        <FormInput type="password" name="currentPassword" onChange={changeUserValue} />
                    </FormDiv>
                    <FormDiv marginBottom={42}>
                        <FormLabel fontSize='14px'>New PW</FormLabel>
                        <FormDiv display='block' marginTop='-2px' height='fit-content' marginBottom={-30}>
                            <FormInput type="password" name="newPassword" onChange={changeUserValue} />
                            <ErrorMessage>{passwordMessage}</ErrorMessage>
                        </FormDiv>
                    </FormDiv>
                    <FormDiv marginBottom={42}>
                        <FormLabel fontSize='14px'>Re New PW</FormLabel>
                        <FormDiv display='block' marginTop='-2px' height='fit-content' marginBottom={-30}>
                            <FormInput type="password" name="reNewPassword" onChange={changeUserValue} />
                            <ErrorMessage>{passwordConfirmMessage}</ErrorMessage>
                        </FormDiv>
                    </FormDiv>
                    <FormDiv marginBottom={42}>
                        <FormLabel fontSize='14px'>Email</FormLabel>
                        <FormDiv display='block' marginTop='-2px' height='fit-content' marginBottom={-30}>
                            <FormInput type="email" name="email" value={user.email} onChange={changeUserValue} />
                            <ErrorMessage>{emailMessage}</ErrorMessage>
                        </FormDiv>
                    </FormDiv>
                    <FormDiv marginBottom={-40}>
                        <FormLabel fontSize='14px'>Introduce</FormLabel>
                        <FormTextarea name='introduce' value={user.introduce} placeholder='유저들에게 자신을 소개해보세요!' onChange={changeUserValue}></FormTextarea>
                    </FormDiv>
                    <Button 
                        bottom={-80} 
                        right={153} 
                        disabled={isNickname && isPassword && isPasswordConfirm && isEmail ? false : true}
                        onClick={editUser}
                    >
                        Edit
                    </Button>
                </FormContainer>
            </FormSpace>
            <DeleteUser onClick={openModal}>탈퇴하기</DeleteUser>
            {
                modal ?
                    <UserDeleteModal closeModal={closeModal} onDelete={onDelete} />
                    : null
            }
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

const DuplicateCheckButton = styled.button`
    position: relative;
    top: 5px;
    background-color: white;
    border: 1px solid gray;
    border-radius: 5px;

    &:hover {
        cursor: pointer;
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

const DeleteUser = styled.span`
    position: fixed;
    left: 80px;
    bottom: 15px;
    color: gray;
    font-size: 13px;
    text-decoration: underline;

    &:hover {
        cursor: pointer;
    }
`;