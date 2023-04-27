import styled from "styled-components";
import { useState } from "react";
import { FormLabel } from "../common";

/* 비공개 게시판 비밀번호 입력 모달 창 */
const UserDeleteModal = ({ closeModal, onDelete }) => {
    // 게시판 정보
    const [check, setCheck] = useState(false);

    // 입력값이 바뀔 때마다 set
    const changeValue = e => {
        setCheck(!check);
    };

    return (
        <ModalOverlay>
            <ModalWrapper>
                <CloseModalButton src={process.env.PUBLIC_URL + '/assets/modalClose.svg'} alt="close" onClick={closeModal} />
                <h4>탈퇴하시겠습니까?</h4>
                <Notation style={{ height: 'fit-content', fontSize: '1.9vmin' }}>
                    탈퇴 시, 유저께서 만드신 게시판이나 포스트잇의 정보들은 삭제되지 않습니다.<br/>
                    삭제를 원하는 게시판과 포스트잇을 삭제한 후 탈퇴해 주시길 바랍니다.<br/>
                    탈퇴를 원하신다면, 동의 박스를 체크하신 후 확인 버튼을 눌러주세요.
                </Notation>
                <FormLabel fontSize='13px'><input type='checkbox' name='agree' value='agree' onChange={changeValue} /> 동의합니다.</FormLabel>
                {
                    check === true ?
                        <ConfirmButton 
                            type="button"
                            disabled={false}
                            onClick={onDelete}
                        >확인</ConfirmButton>
                        : <ConfirmButton 
                            type="button"
                            disabled ={true}
                        >확인</ConfirmButton>
                }
            </ModalWrapper>
        </ModalOverlay>
    );
};

export default UserDeleteModal;

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
    width: 35vw;
    height: 40vh;
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

const Notation = styled.p`
    position: relative;
    height: fit-content;
    padding: 4px 6px 0px 15px;
    margin-bottom: 5vw;
    line-height: 1.5;
    font-size: 1.7vmin;
    text-align: left;
`;

const ConfirmButton = styled.button`
    position: relative;
    width: 5vw;
    height: 4vh;
    margin-left: 1vw;
    margin-right: 8vw;
    font-size: 1.5vmin;
    font-weight: bold;
    text-align: center;
    border: 1px solid black;
    border-radius: 5px;
    background-color: white;
    vertical-align: middle;

    &:hover {
        cursor: pointer;
        outline-color: transparent;
        outline-style: solid;
        color: white;
        background-color: black;
    }

    &:disabled {
        background-color: #D9D9D9;
        color: black;
    }
`;