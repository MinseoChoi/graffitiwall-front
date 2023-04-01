import styled from "styled-components";
import { useEffect, useState, useRef } from "react";
import modalClose from '../../assets/modalClose.svg';

const Modal = ({ postitNo, addPostitValue, closeModal }) => {
    // 포스트잇 정보
    const [postitValue, setPostitValue] = useState({
        postitNo: postitNo,
        title: '',
        content: '',
        color: 'cornsilk',
        x: 0,
        y: 0,
    });

    // input 값이 변경될 때마다 해당 값 set
    const changePostitValue = e => {
        const { name, value } = e.target;
        setPostitValue({
            ...postitValue,
            [name]: value
        })
    };

    // POST 메소드로 포스트잇 정보들 DB에 저장
    const onSubmit = async (e) => {
        await fetch('http://52.78.90.15/api/v1/postits', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postitValue)
        })
        .then(response => response.json())
        .then(json => alert('게시판이 생성되었습니다.'))
        .catch(error => {
            console.log(error);
        });
    };

    return (
        /* 모달 창 */
        <ModalOverlay>
            <ModalWrapper color={postitValue.color}>
                <CloseModalButton src={modalClose} alt="close" onClick={closeModal} />
                <TitleInput type='text' placeholder='제목' onChange={changePostitValue} name='title' required="required" />
                <ContentInput rows='5' cols='33' placeholder='내용' onChange={changePostitValue} name='content' required="required"></ContentInput><br />
                <ColorInput type='color' onChange={changePostitValue} name='color' />
                {
                    postitValue.title === '' || postitValue.content === '' ?
                        <CreatePostitButton 
                            type="submit"
                            disabled ={true}
                            onClick={() => {
                                addPostitValue(postitValue); // '제목-내용' 포스트잇 리스트에 추가
                                closeModal();
                            }}
                        >추가</CreatePostitButton>
                        : <CreatePostitButton 
                            type="submit"
                            disabled={false}
                            onClick={() => {
                                addPostitValue(postitValue); // '제목-내용' 포스트잇 리스트에 추가
                                closeModal();
                            }}
                        >추가</CreatePostitButton>
                }
                
            </ModalWrapper>
        </ModalOverlay>
    );
};

export default Modal;

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
    top: 25%;
    left: 25%;
    width: 40vw;
    height: fit-content;
    background-color: ${props => props.color || 'cornsilk'};
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

const TitleInput = styled.input`
    width: 80%;
    height: 30px;
    margin: 10px;
    font-size: 15px;
    background-color: transparent;
    border-top: none;
    border-left: none;
    border-right: none;
    border-bottom-color: black;
    outline: none;
`;

const ContentInput = styled.textarea`
    width: 80%;
    min-height: 250px;
    padding-top: 8px;
    padding-left: 8px;
    border-radius: 5px;
    outline: none;
`;

const ColorInput = styled.input`
    width: 35px;
    height: 35px;
    padding: 0;
    margin: 0.5rem;
    margin-left: 20px;
    border-color: white;
    border-radius: 50%;
    background-color: transparent;
    cursor: pointer;
    vertical-align: middle;

    &::-webkit-color-swatch {
        height: 120%;
        border-radius: 50%;
        border: none;
    }

    &::-moz-color-swatch {
        border-radius: 50%;
        border: none;
    }
`;

const CreatePostitButton = styled.button`
    width: 80px;
    height: 35px;
    font-size: 13px;
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