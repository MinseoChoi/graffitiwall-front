import styled from "styled-components";
import { useState } from "react";
import { useNavigate  } from 'react-router-dom';
import modalClose from '../../assets/modalClose.svg';

const PasswordModal = ({boardValue, closeModal}) => {
    // 게시판 정보
    const [password, setPassword] = useState(null);

    const [passwordMessage, setPasswordMessage] = useState('');

    const changePassword = e => {
        const { value } = e.target;
        setPassword(value);
    };

    const navigate = useNavigate();
    const onConfirm = () => {
        console.log(boardValue.password);
        if (password === boardValue.password) {
            navigate(`/boards/${boardValue.boardId}`);
        } else {
            setPasswordMessage("비밀번호가 일치하지 않습니다. 다시 입력해주세요.");
        }
    }

    // const onChangePassword = e => {
    //     const currentPassword = e.target.value;
    //     setPassword(currentPassword);
    //     const passwordRegExp = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
    //     if (!passwordRegExp.test(currentPassword)) {
    //         setPasswordMessage("숫자 + 영문자 + 특수문자 조합으로 8자리 이상 입력해주세요.");
    //         setIsPassword(false);
    //     } else {
    //         setPasswordMessage("안전한 비밀번호 입니다.");
    //         setIsPassword(true);
    //     }
    // };

    // POST 메소드로 포스트잇 정보들 DB에 저장
    // const onSubmit = async (e) => {
    //     await request('/postits', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(postitValue)
    //     })
    //     .then(response => response.json())
    //     .then(json => alert('포스트잇이 생성되었습니다.'))
    //     .catch(error => {
    //         console.log(error);
    //     });
    // };

    return (
        /* 모달 창 */
        <ModalOverlay>
            <ModalWrapper method='post'>
                <CloseModalButton src={modalClose} alt="close" onClick={closeModal} />
                <p>비공개 게시판입니다. 비밀번호를 입력해주세요.</p>
                <PasswordInput type='password' placeholder='PASSWORD' onChange={changePassword} name='password' required="required" />
                <ErrorMessage>{passwordMessage}</ErrorMessage>
                {
                    password === null ?
                        <PasswordConfirmButton 
                            disabled ={true}
                        >확인</PasswordConfirmButton>
                        : <PasswordConfirmButton 
                            disabled={false}
                            onClick={() => {
                                onConfirm();
                            }}
                        >확인</PasswordConfirmButton>
                }
            </ModalWrapper>
        </ModalOverlay>
    );
};

export default PasswordModal;

const ModalOverlay = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.2);
    z-index: 9999;
`;

const ModalWrapper = styled.form`
    position: absolute;
    top: 35%;
    left: 35%;
    width: 30vw;
    height: fit-content;
    background-color: white;
    border-radius: 15px;
`;

const CloseModalButton = styled.img`
    position: absolute;
    background-color: transparent;
    right: -45px;
    width: 30px;
    height: 30px;
    padding: 6px;
    border-radius: 8px;
    border-color: transparent;

    &:hover {
        cursor: pointer;
        outline-color: transparent;
        outline-style: solid;
        background: transparent;
        box-shadow: 0 0 0 1px black;
    }
`;

const PasswordInput = styled.input`
    width: 60%;
    height: 30px;
    margin: 10px;
    font-size: 13px;
    background-color: transparent;
    border-top: none;
    border-left: none;
    border-right: none;
    border-bottom-color: black;
    outline: none;
`;

const PasswordConfirmButton = styled.button`
    width: 80px;
    height: 30px;
    margin-bottom: 8px;
    font-size: 11px;
    font-weight: bold;
    text-align: center;
    border-radius: 5px;
    border-color: transparent;
    background-color: transparent;
    vertical-align: middle;

    &:hover {
        cursor: pointer;
        outline-color: transparent;
        outline-style: solid;
        background: transparent;
        box-shadow: 0 0 0 1px black;
    }

    &:disabled {
        background-color: #D9D9D9;
        color: black;
    }
`;

const ErrorMessage = styled.p`
    color: red;
    font-size: 12px;
`;