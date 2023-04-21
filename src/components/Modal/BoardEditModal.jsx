import styled from "styled-components";
import { useCallback, useState, useEffect } from "react";
import modalClose from '../../assets/modalClose.svg';
import { request } from "../../utils/api";
import { boardCategory } from "../../assets/boardCategory";
import { FormDiv, FormLabel, FormInput, Title } from "../common";

/* 게시판 수정 모달 창 */
const BoardEditModal = ({ element, closeModal }) => {
    // 게시판 정보
    const [boardValue, setBoardValue] = useState(element);
    const originBoardName = element.title; // 기존 게시판 이름
    const [boardNameList, setBoardNameList] = useState([]);

    // 오류메시지 상태 지정
    const [boardTitleMessage, setBoardTitleMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');

    // 유효성 검사
    const [isBoardTitle, setIsBoardTitle] = useState(true);
    const [isCategory, setIsCategory] = useState(true);
    const [isPassword, setIsPassword] = useState(element.isPrivate === 'true' ? true: false);

    // GET 메소드로 모든 게시판 이름 가져오기
    useEffect(() => {
        const getBoardList = async () => {
            await request('/boards')
            .then(json => setBoardNameList(json));
        };
        getBoardList();
    }, []);

    // 게시판 이름 중복 체크 함수
    const isExist = (name) => {
        const data = boardNameList.filter(data => data.title === name);
        if (!data.length || name === originBoardName) {
            return false
        } else {
            return true
        }
    };

    // 입력값이 변경될 때마다 해당 값 set
    const changeBoardValue = useCallback(e => {
        const { name, value } = e.target;
        setBoardValue({
            ...boardValue,
            [name]: value
        });

        // 유효성 검사
        if (name === 'title') {
            checkBoardTitle(value);
        } else if (name === 'category') {
            checkBoardCategory(value);
        } else if (name === 'password') {
            checkBoardPassword(value);
        }
    });

    // 게시판 이름 검사
    const checkBoardTitle = value => {
        if (isExist(value)) {
            setBoardTitleMessage("이미 존재하는 게시판 입니다.");
            setIsBoardTitle(false);
        } else if (value.length < 2 || value.length > 20) {
            setBoardTitleMessage("게시판 이름은 2글자 이상 20글자 이하로 입력해주세요.");
            setIsBoardTitle(false);
        } else {
            setBoardTitleMessage("사용가능한 이름 입니다.");
            setIsBoardTitle(true);
        }
    };

    // 게시판 카테고리 검사
    const checkBoardCategory = value => {
        if (value === '') {
            setIsCategory(false);
        } else {
            setIsCategory(true);
        }
    };

    // 비공개 시, 게시판 비밀번호 검사
    const checkBoardPassword = value => {
        if (value.length < 4 || value.length > 12) {
            setPasswordMessage("비밀번호는 4자리 이상 12자리 이하로 입력해주세요.");
            setIsPassword(false);
        } else {
            setPasswordMessage("사용가능한 비밀번호 입니다.");
            setIsPassword(true);
        }
    };

    // 공개 유무 토글 버튼 모드
    const [mode, setMode] = useState(element.isPrivate === 'true' ? 'private' : 'public');

    // 공개 유무 값이 바뀔 때마다 렌더링
    useEffect(() => {
        if (boardValue.isPrivate === 'true') {
            setMode('private');
        } else {
            setMode('public');
            setBoardValue({
                ...boardValue,
                password: null
            });
            setPasswordMessage('');
            setIsPassword(false);
        }
    }, [boardValue.isPrivate]);

    // PATCH 메소드로 게시판 정보 수정
    const onEdit = async (e) => {
        await request(`/boards/${boardValue.boardId}`, {
            method: 'PATCH',
            body: JSON.stringify(boardValue)
        })
        .then(json => alert('게시판이 수정되었습니다.'));
    };

    return (
        <SelectedBoardContainer>
            <CloseModalButton src={modalClose} alt="게시판 수정 창 닫기" onClick={closeModal} />
            <ModalTitle>게시판 수정</ModalTitle>
            <FormDiv display='block' padding='80px calc(1rem + 0.5vw)' textAlign='center'>
                <FormDiv marginBottom={40}>
                    <FormLabel fontSize='calc(0.6rem + 0.2vw)'>게시판 이름</FormLabel>
                    <FormDiv display='block' height='fit-content' marginBottom={-2}>
                        <FormInput type='text' padding='2px 3px' top='-10px' width='calc(0.4rem + 10vw)' height={20} fontSize='calc(0.6rem + 0.15vw)' name='title' value={boardValue.title} onChange={changeBoardValue} />
                        <ErrorMessage top={-5}>{boardTitleMessage}</ErrorMessage>
                    </FormDiv>
                </FormDiv>
                <FormDiv>
                    <FormLabel fontSize='calc(0.6rem + 0.2vw)'>카테고리</FormLabel>
                    <SelectCategory>
                        <select style={{ width: 'calc(1rem + 8vw)' }} name="category" defaultValue={boardValue.category} onChange={changeBoardValue}>
                            <option value=''>--- 카테고리를 선택해주세요. ---</option>
                            {boardCategory.map(value =>
                                <option key={value.id} value={value.category}>{value.name}</option>
                            )}
                        </select>
                    </SelectCategory>
                </FormDiv>
                <FormDiv>
                    <FormLabel fontSize='calc(0.6rem + 0.2vw)'>공개 유무</FormLabel>
                    <FormDiv display='block' marginBottom={35}>
                        <Switch value={mode}>
                            <span />
                            <PublicBtn type="button" name='isPrivate' value={false} mode={mode} onClick={changeBoardValue} >
                                공개
                            </PublicBtn>
                            <PrivateBtn type="button" name='isPrivate' value={true} mode={mode} onClick={changeBoardValue}>
                                비공개
                            </PrivateBtn>
                        </Switch>
                        {boardValue.isPrivate === 'true' ? (
                            <FormDiv width={12} marginTop='12px' marginBottom={-25}>
                                <FormLabel width={60} fontSize='calc(0.5rem + 0.15vw)' color='gray'>비밀번호</FormLabel>
                                <FormDiv display='block' height='fit-content' marginTop='-2px' marginBottom={-20}>
                                    <FormInput padding='2px 3px' width='calc(0.5rem + 5vw)' height={10} fontSize='10px' type='password' name='password' onChange={changeBoardValue} />
                                    <ErrorMessage top={4}>{passwordMessage}</ErrorMessage>
                                </FormDiv>
                            </FormDiv>
                        ) : null}
                    </FormDiv> 
                </FormDiv>
                <FormDiv justifyContent='center'>
                    {
                        isBoardTitle === true && isCategory === true && (boardValue.isPrivate === 'false' || (boardValue.isPrivate === 'true' && isPassword === true)) ?
                            <EditBoardButton 
                                type="submit"
                                disabled ={false}
                                onClick={() => {
                                    closeModal();
                                    onEdit();
                                }}
                            >수정</EditBoardButton>
                            : <EditBoardButton 
                                type="submit"
                                disabled={true}
                                onClick={() => {
                                    closeModal();
                                }}
                            >수정</EditBoardButton>
                    }
                </FormDiv>
            </FormDiv>
        </SelectedBoardContainer>
    );
};

export default BoardEditModal;

const SelectedBoardContainer = styled.div`
    position: relative;
    top: 42px;
    left: 10px;
    width: 35vw;
    height: 60vh;
    text-align: center;
    font-size: 13px;
    background-color: #DDDDDD;
    border-radius: 8px;
    box-shadow: 5px 5px 3px rgb(0, 0, 0, 0.06);
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

const ModalTitle = styled.p`
    position: relative;
    width: 20vw;
    top: 30px;
    left: 30px;
    padding: 4px 6px;
    font-size: calc(0.8rem + 0.4vw);
    text-align: left;
    border-bottom: 1px solid black;
`;

const SelectCategory = styled.fieldset`
    position: relative;
    margin-left: -6px;
    padding: 4px 6px;
    top: -4px;
    height: 15px;
    font-size: 13px;
    border: none;
`;

const Switch = styled.div`
    position: relative;
    width: calc(1rem + 8vw);
    height: 24px;
    margin-top: -8px;
    padding-bottom: 4px;
    background-color: white;
    border: 1px solid gray;
    border-radius: 10px 10px 10px 10px;
    span {
        position: absolute;
        // width: calc(1rem + 2.4vw);
        width: 48%;
        height: 24px;
        top: 2px;
        margin-left: 2px;
        border-radius: 5px;
        background-color: white;
        transition: all 0.6s ease-in-out;
        z-index: 3;
        opacity: 0.4;
        ${props => props.value === 'public' ? 'transform: translateX(0px)'
        : 'transform: translateX(100%)'}
    }
`;

const PublicBtn = styled.button`
    position: relative;
    top: 2px;
    // width: calc(1rem + 2.4vw);
    width: 48%;
    height: 24px;
    margin-left: 3px;
    color: ${props => props.mode === 'public' ? 'black' : 'gray'};
    background-color: ${props => props.mode === 'public' ? '#B0D7B2' : 'white'};
    border: none;
    border-radius: 10px;
    font-size: calc(0.4rem + 0.2vw);
    cursor: pointer;
    z-index: 2;
    transition: color 2s ease;
`;

const PrivateBtn = styled.button`
    position: relative;
    top: 2px;
    // width: calc(1rem + 2.4vw);
    width: 48%;
    height: 24px;
    color: ${props => props.mode === 'private' ? 'black' : 'gray'};
    background-color: ${props => props.mode === 'private' ? '#B0D7B2' : 'white'};
    border: none;
    border-radius: 10px;
    font-size: calc(0.4rem + 0.2vw);
    cursor: pointer;
    z-index: 2;
    transition: color 2s ease;
`;

const ErrorMessage = styled.p`
    position: relative;
    margin-top: 0px;
    margin-bottom: -26px;
    top: ${props => props.top}px;
    left: 4px;
    height: 12px;
    color: red;
    font-size: 11px;
`;

const EditBoardButton = styled.button`
    position: relative;
    width: calc(1rem + 4vw);
    height: calc(1rem + 2.5vh);
    font-size: calc(0.5rem + 0.3vw);
    font-weight: bold;
    text-align: center;
    border: 1px solid black;
    border-radius: 5px;
    background-color: white;
    color: black;

    &:hover {
        cursor: pointer;
        outline-color: transparent;
        outline-style: solid;
        border: none;
        background-color: black;
        color: white;
    }

    &:disabled {
        background-color: #D9D9D9;
        color: black;
    }
`;