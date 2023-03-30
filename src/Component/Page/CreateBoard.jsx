import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { Button } from '../../utils/Button.js';
import { Title } from '../../utils/Title.js';
import { FormContainer } from '../../utils/FormContainer.js';
import { FormDiv } from '../../utils/FormDiv.js';
import { FormLabel } from '../../utils/FormLabel.js';
import { FormInput } from '../../utils/FormInput.js';
import { request } from '../../utils/api.js';

const DUMMY_CATEGORY = [
    {
        id: 1,
        category: 'lecture',
        name: '강의',
    },
    {
        id: 2,
        category: 'sports',
        name: '스포츠',
    },
    {
        id: 3,
        category: 'beauty',
        name: '뷰티',
    },
    {
        id: 4,
        category: 'travel',
        name: '여행',
    },
    {
        id: 5,
        category: 'drama',
        name: '드라마',
    },
    {
        id: 6,
        category: 'game',
        name: '게임',
    },
    {
        id: 7,
        category: 'cooking',
        name: '요리'
    },
]

const CreateBoard = () => {
    // tag 디자인 변경 필요 -> 일단 카테고리로
    // 게시판 이름 중복 예외처리
    // 카테고리 선택하지 않았을 때 생성 X
    // 공개 / 비공개 선택하지 않았을 시 생성 X
    // 비공개인데, 비밀번호를 입력하지 않았을 때 생성 X

    // 게시판 정보
    const [boardValue, setBoardValue] = useState({
        title: '',
        category: '',
        password: null,
        userId: 1,
        isPrivate: false
    });

    // 게시판 정보가 바뀔 때마다 set
    const changeBoardValue = e => {
        const { name, value } = e.target;
        setBoardValue({
            ...boardValue,
            [name]: value
        });
    };

    // const [tags, setTags] = useState([]);
    // const [text, setText] = useState('');

    // const addTag = () => {
    //     if (text.length === 0) return;
    //     setTags([...tags, text]);
    //     setText('');
    // };

    // const deleteTag = (e) => {
    //     const deleteTagItem = e.target.parentElement.firstChild.innerText;
    //     setTags(tags.filter(text => text !== deleteTagItem));
    //     // setTags(tags.filter((tag, index) => index !== deleteIndex));
    // };

    // 버튼 클릭 시, POST 메소드로 입력한 게시판 정보들 DB에 저장
    const onSubmit = async e => {
        e.preventDefault();

        console.log(boardValue);
        await fetch('http://52.78.90.15/api/v1/boards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(boardValue)
        })
        .then(response => response.json())
        .then(json => alert('게시판이 생성되었습니다.'))
        .catch(error => {
            console.log(error);
        });

        // GET
        // const datas = await request('/boards/1')
        // .then((response) => response.json())
        // .then((json) => );

        // const datas = await request('/boards/1');
        // console.log(datas)
        
        // await fetch('http://52.78.90.15/api/v1/boards/1')
        // .then(response => response.json())
        // .then(json => console.log(json));
        // console.log(boardValue);
        
        // axios.get('http://localhost:3000/api/v1/boards/1')
        // .then((response) => {
        //     setData(response.data);
        //     console.log('success')
        // })
        // .catch(error => {
        //     console.log(error)
        // })
    }

    return (
        <div key="createBoard" className="createBoard">
            <Title>Create Board</Title>
            <FormContainer method='POST' top={50} left={-10}>
                <FormDiv>
                    <FormLabel>게시판 이름</FormLabel>
                    <FormInput type='text' name='title' onChange={changeBoardValue} />
                </FormDiv>
                <FormDiv>
                    <FormLabel>카테고리</FormLabel>
                    <SelectCategory>
                        <select name='category' onChange={changeBoardValue}>
                            <option value=''>--- 카테고리를 선택해주세요. ---</option>
                            {DUMMY_CATEGORY.map(value => 
                                <option key={value.id} value={value.category}>{value.name}</option>
                            )}
                        </select>
                    </SelectCategory>
                    {/* <FormLabel>Tag</FormLabel>
                    {tags.map((tag, index) => (
                        <li key={index} className='tagList'>
                            <div>{tag}</div>
                            <button onClick={deleteTag}>X</button>
                        </li>
                    ))}
                    <FormDiv>
                        <TagInput 
                            onChange={e => setText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addTag();
                                }
                            }}
                            type="text"
                            value={text} />
                        <button onClick={addTag} type="button">+</button>
                    </FormDiv> */}
                </FormDiv>
                <FormDiv textAlign='center'>
                    <FormLabel>공개 유무</FormLabel>
                    <FormDiv padding='4px 6px' width={50} height='15px'>
                        <FormDiv textAlign='center'>
                            <RadioInput type="radio" name="private" value={false} onClick={() => setBoardValue({ ...boardValue, isPrivate: false})} />
                            <RadioValue>공개</RadioValue>
                        </FormDiv>
                        <FormDiv textAlign='center'>
                            <RadioInput type="radio" name="private" value={true} onClick={() => setBoardValue({ ...boardValue, isPrivate: true})} />
                            <RadioValue>비공개</RadioValue>
                        </FormDiv>
                        {boardValue.isPrivate ? (
                            <FormDiv>
                                <FormLabel width={60} fontSize={11} color='gray'>비밀번호</FormLabel>
                                <FormInput padding='2px 3px' width='80px' height={10} fontSize={10} type='password' name='password' onChange={changeBoardValue} />
                            </FormDiv>
                        ) : null}
                    </FormDiv>
                </FormDiv>
                <Button onClick={onSubmit}>Create</Button>
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