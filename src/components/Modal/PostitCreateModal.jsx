import styled from "styled-components";
import { useState } from "react";
import { fontData } from "../../assets/fontData";
import { request } from "../../utils/api";
import { useEffect } from "react";

/* 포스트잇 생성 모달 창 */
const PostitCreateModal = ({ boardId, postitId, addPostitValue, closeModal }) => {
    // 포스트잇 정보
    const [postitValue, setPostitValue] = useState({
        boardId: boardId,
        userId: 1,
        postitId: postitId,
        title: '',
        contents: '',
        font: '',
        color: 'cornsilk',
        positionX: 0,
        positionY: 0,
        angle: 0,
        sizeX: 100,
        sizeY: 100,
        views: 0,
        writer: '',
    });

    let sessionStorage = window.sessionStorage;

    useEffect(() => {
        const sessionSearch = sessionStorage.getItem('userRawId');

        const getUserData = async () => {
            await request(`/users/${sessionSearch}`)
            .then(json => {
                setPostitValue({
                    ...postitValue,
                    userId: json.id,
                    writer: json.nickname
                })
            })
        };

        if (sessionSearch) {
            getUserData();            
        } else {
            alert('로그인이 필요한 서비스입니다.');
            return;
        }
    }, []);

    // 입력값이 변경될 때마다 해당 값 set
    const changePostitValue = e => {
        const { name, value } = e.target;
        setPostitValue({
            ...postitValue,
            [name]: value
        })
    };

    // POST 메소드로 포스트잇 정보 저장
    const onSubmit = async (e) => {
        await request('/postit', {
            method: 'POST',
            body: JSON.stringify({
                ...postitValue,
                contents: (postitValue.contents).replace(/<br\s*\?>/g, '\n')
            })
        })
        .then(json => {
            alert('포스트잇 생성되었습니다.');
        })
    };

    return (
        <ModalOverlay>
            <ModalWrapper color={postitValue.color}>
                <CloseModalButton src={process.env.PUBLIC_URL + '/assets/modalClose.svg'} alt="close" onClick={closeModal} />
                <TitleInput fontFamily={postitValue.font} type='text' placeholder='제목' onChange={changePostitValue} name='title' required="required" />
                <ContentInput fontFamily={postitValue.font} rows='5' cols='33' wrap="hard" placeholder='내용' onChange={changePostitValue} name='contents' required="required"></ContentInput><br />
                <SelectFont>
                    <select name='font' onChange={changePostitValue}>
                        <option value=''>--- 폰트를 선택해주세요. ---</option>
                        {fontData.map(value => 
                            <option key={value.id} value={value.font}>{value.name}</option>
                        )}
                    </select>
                </SelectFont>
                <ColorInput type='color' onChange={changePostitValue} name='color' />
                {
                    postitValue.title === '' || postitValue.contents === '' ?
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
                                onSubmit();
                            }}
                        >추가</CreatePostitButton>
                }
            </ModalWrapper>
        </ModalOverlay>
    );
};

export default PostitCreateModal;

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

const TitleInput = styled.input`
    width: 80%;
    height: 30px;
    margin: 10px;
    font-family: ${props => props.fontFamily};
    font-size: 18px;
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
    font-family: ${props => props.fontFamily};
    font-size: 15px;
    border-radius: 5px;
    outline: none;
`;

const SelectFont = styled.fieldset`
    position: relative;
    margin: 0 auto;
    padding: 4px 6px;
    height: 15px;
    font-size: 13px;
    border: none;
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