import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { request } from '../utils/api';
import { Button, Title, FormContainer, FormDiv, FormLabel, FormInput } from '../components/common';
import { boardCategory } from '../assets/boardCategory';

const CreateBoard = () => {
    // DB에 있는 게시판 정보들 가져와 저장
    const [boardNameList, setBoardNameList] = useState([]);
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
        if (!data.length) {
            return false
        } else {
            return true
        }
    }

    // 게시판 정보 (게시판 이름, 카테고리, 공개 유무, 비공개 시 비밀번호)
    const [boardValue, setBoardValue] = useState({
        title: '',
        category: '',
        password: null,
        userId: 1,
        isPrivate: false
    });

    // 오류메시지 상태 지정
    const [boardTitleMessage, setBoardTitleMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');

    // 유효성 검사
    const [isBoardTitle, setIsBoardTitle] = useState(false);
    const [isCategory, setIsCategory] = useState(false);
    const [isPassword, setIsPassword] = useState(false);

    // 공개 유무 토글 버튼 모드
    const [mode, setMode] = useState('');

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

    // 게시판 정보가 바뀔 때마다 set
    const changeBoardValue = e => {
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
    };

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

    const checkBoardCategory = value => {
        if (value === '') {
            setIsCategory(false);
        } else {
            setIsCategory(true);
        }
    };

    const checkBoardPassword = value => {
        if (value.length < 4 || value.length > 12) {
            setPasswordMessage("비밀번호는 4자리 이상 12자리 이하로 입력해주세요.");
            setIsPassword(false);
        } else {
            setPasswordMessage("사용가능한 비밀번호 입니다.");
            setIsPassword(true);
        }
    };

    // 버튼 클릭 시, POST 메소드로 입력한 게시판 정보들 DB에 저장
    const onSubmit = async e => {
        e.preventDefault();

        // POST
        await request('/boards', {
            method: 'POST',
            body: JSON.stringify(boardValue)
        })
        .then(json => alert('게시판이 생성되었습니다.'));
    };

    return (
        <div key="createBoard" className="createBoard">
            <Title>Create Board</Title>
            <FormSpace>
                <FormContainer top={50} left={-10}>
                    <FormDiv>
                        <FormLabel fontSize='14px'>게시판 이름</FormLabel>
                        <FormDiv display='block' height='fit-content' marginBottom={-25}>
                            <FormInput top='-8px' type='text' name='title' onChange={changeBoardValue} />
                            <ErrorMessage>{boardTitleMessage}</ErrorMessage>
                        </FormDiv>
                    </FormDiv>
                    <FormDiv>
                        <FormLabel fontSize='14px'>카테고리</FormLabel>
                        <SelectCategory>
                            <select name='category' onChange={changeBoardValue}>
                                <option value=''>--- 카테고리를 선택해주세요. ---</option>
                                {boardCategory.map(value => 
                                    <option key={value.id} value={value.category}>{value.name}</option>
                                )}
                            </select>
                        </SelectCategory>
                    </FormDiv>
                    <FormDiv textAlign='center'>
                        <FormLabel fontSize='14px'>공개 유무</FormLabel>
                        <FormDiv padding='4px 6px' width={50} height='15px'>
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
                                <FormDiv>
                                    <FormLabel width={60} fontSize='11px' color='gray'>비밀번호</FormLabel>
                                    <FormDiv display='block' height='fit-content' marginTop='-6px' marginBottom={-25}>
                                        <FormInput padding='2px 3px' width='80px' height={10} fontSize='10px' type='password' name='password' onChange={changeBoardValue} />
                                        <ErrorMessage>{passwordMessage}</ErrorMessage>
                                    </FormDiv>
                                </FormDiv>
                            ) : null}
                        </FormDiv>
                    </FormDiv>
                    {isBoardTitle === true && isCategory === true && (boardValue.isPrivate === 'false' || (boardValue.isPrivate === 'true' && isPassword === true)) ?
                        <Button 
                            right={150}
                            onClick={onSubmit}
                            disalbed={false}
                        >Create</Button>
                        : <Button
                            right={150}
                            onClick={onSubmit}
                            disabled={true}
                        >Create</Button>
                    }
                </FormContainer>
            </FormSpace>
        </div>
    );
};

export default CreateBoard;

const FormSpace = styled.div`
    position: absolute;
    top: 230px;
    left: 100px;
    width: 80%;
    height: 70vh;
`;

const SelectCategory = styled.fieldset`
    position: relative;
    margin: 0 auto;
    padding: 4px 6px;
    top: -2px;
    width: 50vw;
    height: 15px;
    font-size: 13px;
    border: none;
`;

const Switch = styled.div`
    position: relative;
    width: 100px;
    height: 24px;
    margin-top: -8px;
    padding-bottom: 4px;
    background-color: white;
    border: 1px solid gray;
    border-radius: 10px 10px 10px 10px;
    span {
        position: absolute;
        width: 46px;
        height: 24px;
        top: 2px;
        margin-left: 4px;
        border-radius: 5px;
        background-color: white;
        transition: all 0.6s ease-in-out;
        z-index: 3;
        opacity: 0.4;
        ${props => props.value === 'public' ? 'transform: translateX(0px)'
        : 'transform: translateX(48px)'}
    }
`;

const PublicBtn = styled.button`
    position: relative;
    width: 46px;
    height: 24px;
    margin-left: 4px;
    color: ${props => props.mode === 'public' ? 'black' : 'gray'};
    background-color: ${props => props.mode === 'public' ? '#B0D7B2' : 'white'};
    border: none;
    border-radius: 10px;
    font-size: 10px;
    cursor: pointer;
    z-index: 2;
    transition: color 2s ease;
`;

const PrivateBtn = styled.button`
    position: relative;
    width: 46px;
    height: 24px;
    color: ${props => props.mode === 'private' ? 'black' : 'gray'};
    background-color: ${props => props.mode === 'private' ? '#B0D7B2' : 'white'};
    border: none;
    border-radius: 10px;
    font-size: 10px;
    cursor: pointer;
    z-index: 2;
    transition: color 2s ease;
`;

const ErrorMessage = styled.p`
    color: red;
    font-size: 12px;
`;