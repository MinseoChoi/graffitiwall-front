import styled from 'styled-components';
import { useState } from 'react';
import { Button, Title, FormContainer, FormDiv, FormLabel, FormInput, Image } from '../components/common';
import user from '../assets/user.svg';

const Profile = () => {
    // 프로필 img로 변경 필요
    // PW 변경 원할 시, Current PW와 New PW가 일치하지 않도록
    //               New PW와 Re New PW가 일치하도록 검사
    // 프로필에서는 변경사항이 없는 상태에서 변경 버튼을 누르면 기존 정보로 유지
    const [image, setImage] = useState('');

    return (
        <div key="profile">
            <Title>My Profile</Title>
            <FormContainer>
                <FormDiv>
                    <FormLabel>Profile Image</FormLabel>
                    <FormDiv padding='4px 6px' marginBottom={-25} width={50}>
                        <Image src={user} />
                    </FormDiv>
                </FormDiv>
                <FormDiv>
                    <FormLabel>NickName</FormLabel>
                    <FormInput type="text" name="nickname" />
                </FormDiv>
                <FormDiv>
                    <FormLabel>Current PW</FormLabel>
                    <FormInput type="password" name="currentPassword" />
                </FormDiv>
                <FormDiv>
                    <FormLabel>New PW</FormLabel>
                    <FormInput type="password" name="newPassword" />
                </FormDiv>
                <FormDiv>
                    <FormLabel>Re New PW</FormLabel>
                    <FormInput type="password" name="reNewPassword" />
                </FormDiv>
                <FormDiv>
                    <FormLabel>Introduce</FormLabel>
                    <FormTextarea placeholder='유저들에게 자신을 소개해보세요!'></FormTextarea>
                </FormDiv>
                <Button onClick={() => alert('프로필이 수정되었습니다.')}>Edit</Button>
            </FormContainer>
        </div>
    );
};

export default Profile;

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