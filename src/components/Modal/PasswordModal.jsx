import styled from "styled-components";
import { useState } from "react";
import { useNavigate  } from 'react-router-dom';
import modalClose from '../../assets/modalClose.svg';

/* 비공개 게시판 비밀번호 입력 모달 창 */
const PasswordModal = ({boardValue, closeModal}) => {
    // 게시판 정보
    const [password, setPassword] = useState(0);

    // 오류메시지 상태 지정
    const [passwordMessage, setPasswordMessage] = useState('');

    // 입력값이 바뀔 때마다 set
    const changePassword = e => {
        const { value } = e.target;
        
        setPassword(value);
        setPasswordMessage('');
    };

    // 비밀번호 검사 후, 선택한 게시판 url로 라우팅
    const navigate = useNavigate();
    const onConfirm = () => {
        if (password !== boardValue.password) {
            setPasswordMessage('비밀번호가 일치하지 않습니다. 다시 입력해주세요.');
        } else {
            navigate(`/boards/${boardValue.boardId}`);
        }
    }

    return (
        <ModalOverlay>
            <ModalWrapper>
                <CloseModalButton src={modalClose} alt="close" onClick={closeModal} />
                <p style={{ fontSize: '1.9vmin' }}>비공개 게시판입니다. 비밀번호를 입력해주세요.</p>
                <PasswordInput type='password' placeholder='PASSWORD' onChange={changePassword} name='password' required="required" autoFocus/>
                <ErrorMessage>{passwordMessage}</ErrorMessage>
                {
                    password.length < 4 || password.length > 12 ?
                        <PasswordConfirmButton 
                            type="button"
                            disabled ={true}
                        >확인</PasswordConfirmButton>
                        : <PasswordConfirmButton 
                            type="button"
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
    box-shadow: 10px 10px 5px rgb(0, 0, 0, 0.1);
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