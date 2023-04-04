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

    // 게시판 정보가 바뀔 때마다 set
    const changeBoardValue = e => {
        const { name, value } = e.target;
        console.log(name, value)
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
            console.log(value);
            console.log(isPassword);
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
    }

    return (
        <div key="createBoard" className="createBoard">
            <Title>Create Board</Title>
            <FormContainer method='POST' top={50} left={-10}>
                <FormDiv>
                    <FormLabel>게시판 이름</FormLabel>
                    <FormDiv display='block' height='fit-content' marginBottom={-25}>
                        <FormInput type='text' name='title' onChange={changeBoardValue} />
                        <ErrorMessage>{boardTitleMessage}</ErrorMessage>
                    </FormDiv>
                </FormDiv>
                <FormDiv>
                    <FormLabel>카테고리</FormLabel>
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
                    <FormLabel>공개 유무</FormLabel>
                    <FormDiv padding='4px 6px' width={50} height='15px'>
                        <FormDiv textAlign='center'>
                            <RadioInput type="radio" name="isPrivate" value={false} onClick={changeBoardValue} />
                            <RadioValue>공개</RadioValue>
                        </FormDiv>
                        <FormDiv textAlign='center'>
                            <RadioInput type="radio" name="isPrivate" value={true} onClick={changeBoardValue} />
                            <RadioValue>비공개</RadioValue>
                        </FormDiv>
                        {boardValue.isPrivate === 'true' ? (
                            <FormDiv>
                                <FormLabel width={60} fontSize={11} color='gray'>비밀번호</FormLabel>
                                <FormDiv display='block' height='fit-content' marginBottom={-25}>
                                    <FormInput padding='2px 3px' width='80px' height={10} fontSize={10} type='password' name='password' onChange={changeBoardValue} />
                                    <ErrorMessage>{passwordMessage}</ErrorMessage>
                                </FormDiv>
                            </FormDiv>
                        ) : null}
                    </FormDiv>
                </FormDiv>
                {isBoardTitle === true && isCategory === true && (boardValue.isPrivate === 'false' || (boardValue.isPrivate === 'true' && isPassword === true)) ?
                    <Button 
                        onClick={onSubmit}
                        disalbed={false}
                    >Create</Button>
                    : <Button
                        onClick={onSubmit}
                        disabled={true}
                    >Create</Button>
                }
            </FormContainer>
        </div>
    );
};

export default CreateBoard;

const TagInput = styled.input`
    margin: 0 auto;
    padding: 4px 6px;
    width: 50vw;
    height: 15px;
    font-size: 13px;
    border: 1px solid black;
    border-radius: 5px;
`;

const SelectCategory = styled.fieldset`
    margin: 0 auto;
    padding: 4px 6px;
    width: 50vw;
    height: 15px;
    font-size: 13px;
    border: none;
`;

const RadioInput = styled.input`
    vertical-align: middle;
`;

const RadioValue = styled.span`
    display: inline-block;
    width: 100px;
    font-size: 13px;
`;

const ErrorMessage = styled.p`
    color: red;
    font-size: 12px;
`;