import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { request } from '../utils/api';
import { Button, Title, FormContainer, FormDiv, FormLabel, FormInput, Image } from '../components/common';
import userImage from '../assets/user.svg';

const Profile = () => {
    // 프로필 img로 변경 필요
    // PW 변경 원할 시, Current PW와 New PW가 일치하지 않도록
    //               New PW와 Re New PW가 일치하도록 검사
    // 프로필에서는 변경사항이 없는 상태에서 변경 버튼을 누르면 기존 정보로 유지?
    const [user, setUser] = useState({
        id: 1,
        userId: '',
        password: '',
        email: '',
        imageUrl: null,
        introduce: '',
        status: 'ACTIVE'
    });
    const [image, setImage] = useState('');

    // GET 메소드로 유저 정보 가져오기
    useEffect(() => {
        const getUser = async () => {
            await request('/users/1')
            .then(json => setUser(json))
        };
        getUser();
    }, []);

    const changeUserValue = e => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value
        });
    };

    const editUser = async e => {
        e.preventDefault();

        await request('/users/1', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
        })
        .then(json => alert('프로필이 수정되었습니다.'));
    };

    return (
        <div key="profile">
            <Title>My Profile</Title>
            <FormSpace>
                <FormContainer>
                    <FormDiv marginBottom={30}>
                        <FormLabel>Profile Image</FormLabel>
                        <FormDiv padding='4px 6px' marginBottom={-25} width={50}>
                            <Image src={userImage} />
                        </FormDiv>
                    </FormDiv>
                    <FormDiv marginBottom={25}>
                        <FormLabel>NickName</FormLabel>
                        <FormInput type="text" name="userId" value={user.userId} onChange={changeUserValue} />
                    </FormDiv>
                    <FormDiv marginBottom={25}>
                        <FormLabel>Current PW</FormLabel>
                        <FormInput type="password" name="currentPassword" />
                    </FormDiv>
                    <FormDiv marginBottom={25}>
                        <FormLabel>New PW</FormLabel>
                        <FormInput type="password" name="newPassword" />
                    </FormDiv>
                    <FormDiv marginBottom={25}>
                        <FormLabel>Re New PW</FormLabel>
                        <FormInput type="password" name="reNewPassword" />
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