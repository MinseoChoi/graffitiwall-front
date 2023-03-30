import styled from "styled-components";
import { useNavigate  } from 'react-router-dom';
import { Title } from "../../utils/Title";
import add from '../../image/addPostit.svg';
import { useAsync } from "../../utils/useAsync";
import { useEffect, useState } from "react";

/* 메인 창 - 전체 게시판 & 조회수가 높은 게시판 & 랜덤 게시판 */
const BoardList = () => {
    // 각 목록마다 보여줄 리스트 개수 정해두기(총 20개 ? 각 페이지마다 5개 ?)
    // 버튼 추가해서 페이지 목록 추가
    const dataList = [
        {
            id: 1,
            name: 'board1'
        },
        {
            id: 2,
            name: 'board2'
        },
        {
            id: 3,
            name: 'board3'
        },
        {
            id: 4,
            name: 'board4'
        },
        {
            id: 5,
            name: 'board5'
        },
        {
            id: 6,
            name: 'board6'
        },
        {
            id: 7,
            name: 'board7'
        },
        {
            id: 8,
            name: 'board8'
        },
        {
            id: 9,
            name: 'board9'
        },
        {
            id: 10,
            name: 'board10'
        }
    ];

    // 게시판 목록 저장
    const [boardList, setBoardList] = useState([]);

    // GET 메소드로 전체 게시판 목록 가져오기
    useEffect(() => {
        const getBoardList = async () => {
            await fetch('http://52.78.90.15/api/v1/boards')
            .then(response => response.json())
            .then(json => setBoardList(json))
        }
        getBoardList();
    }, []);

    // const [state, refetch] = useAsync(getJson, [], true);
    // const { loading, data: boards, error } = state;
    // // console.log(boards);

    // if (!loading && boards) {
    //     console.log(boards);
    // }

    // 라우팅
    const navigate = useNavigate();
    const handleClick = (boardName) => {
        navigate(`/boards/${boardName}`);
    };

    return (
        <div key="boardList" className="boardList">
            <Title>Board List</Title>
            <BoardContainer>
                <BoardSpace>
                    <ListTitle>👍🏻 인기 게시판</ListTitle>
                    <BoardWrapper>
                        {dataList.map(element => 
                            <Board key={element.id} onClick={() => handleClick(element.id)}>
                                {element.name}
                            </Board>
                        )}
                    </BoardWrapper>
                    <ListTitle>🎲 랜덤 게시판</ListTitle>
                    <BoardWrapper>
                        {dataList.map(element => 
                            <Board key={element.id} onClick={() => handleClick(element.id)}>
                                {element.name}
                            </Board>
                        )}
                    </BoardWrapper>
                </BoardSpace>
                <BoardSpace>
                    <ListTitle>🗒️ 전체 게시판</ListTitle>
                    <BoardWrapper>
                        {boardList.map(element =>
                            <Board key={element.boardId} onClick={() => handleClick(element.boardId)}>
                                {element.title}
                            </Board>
                        )}
                    </BoardWrapper>
                </BoardSpace>
            </BoardContainer>
            <AddBoardButton src={add} alt="addBoard" onClick={() => handleClick('create')} />
        </div>
    );
};

export default BoardList;

const BoardContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
`;

const BoardSpace = styled.div`
    position: relative;
    top: -10px;
    left: 50px;
    margin-right: 120px;
`;

const ListTitle = styled.h4`
    position: relative;
    width: 200px;
    padding: 4px 6px;
    text-align: left;
    font-weight: bold;
    border: none;
    border-bottom: 1px solid black;
`;

const BoardWrapper = styled.ul`
    position: relative;
    left: 20px;
    width: 35vw;
    text-align: left;
    font-size: 13px;
    background-color: #DDDDDD;
    border-radius: 5px;
    overflow: auto;
`;

const Board = styled.li`
    display: block;
    padding-bottom: 6px;
    margin-top: 10px;
    margin-left: -20px;
    margin-right: 20px;
    margin-bottom: 6px;
    border-bottom: 1px solid white;
    list-style-type: none;

    &:hover {
        cursor: pointer;
        font-weight: bold;
    }
`;

const AddBoardButton = styled.img`
    position: fixed;
    display: inline-block;
    bottom: 15px;
    right: 25px;
    width: 40px;
    height: 40px;
    background-color: transparent;
    border: 2px solid black;
    border-radius: 8px;
    transition: 0.8s ease;
    overflow: hidden;

    &:hover {
        cursor: pointer;
        outline-color: transparent;
        outline-style: solid;
        box-shadow: 0 0 0 1px black;
    }
`;