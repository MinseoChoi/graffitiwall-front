import styled from "styled-components";
import { useEffect, useState } from "react";
import { useNavigate  } from 'react-router-dom';
import { request } from "../utils/api.js";
import PasswordModal from "../components/Modal/PasswordModal.jsx";
import { Title } from "../components/common/Title.js";
import add from '../assets/addPostit.svg';

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

/* 메인 창 - 전체 게시판 & 조회수가 높은 게시판 & 랜덤 게시판 */
const BoardList = () => {
    // 게시판 목록 저장
    const [boardList, setBoardList] = useState([]);
    const [popularBoardList, setPopularBoardList] = useState([]);
    const [randomBoardList, setRandomBoardList] = useState([]);
    
    // 페이지네이션 -> 코드 간소화 필요
    const [limit, setLimit] = useState(5);
    const [popularPage, setPopularPage] = useState(1);
    const [randomPage, setRandomPage] = useState(1);
    const [allPage, setAllPage] = useState(1);
    const popularOffset = (popularPage - 1) * limit;
    const randomOffset = (randomPage - 1) * limit;
    const allOffset = (allPage - 1) * (limit + 5);
    const numPages = Math.ceil(dataList.length / limit);
    const allNumPages = Math.ceil(boardList.length / (limit + 5));

    const handlePopularPageChange = page => {
        setPopularPage(page);
    };

    const handleRandomPageChange = page => {
        setRandomPage(page);
    };

    const handleAllPageChange = page => {
        setAllPage(page);
    };

    // GET 메소드로 전체 게시판 목록 가져오기
    useEffect(() => {
        const getAllBoardList = async () => {
            await request('/boards')
            .then(json => setBoardList(json))
        };
        getAllBoardList();
    }, []);

    // const [state, refetch] = useAsync(getJson, [], true);
    // const { loading, data: boards, error } = state;
    // // console.log(boards);

    // if (!loading && boards) {
    //     console.log(boards);
    // }
    const [selectedPrivateValue, setSelectedPrivateValue] = useState({
        private: false,
        boardId: 1,
        password: null
    });

    // 선택한 게시판 url로 라우팅
    const navigate = useNavigate();
    const handleBoardClick = (boardValue) => {
        if (boardValue.private === true) {
            setSelectedPrivateValue({
                private: true,
                boardId: boardValue.boardId,
                password: boardValue.password
            });
            openModal();
            return;
            // 비밀번호 입력 창 생성 필요
        }
        navigate(`/boards/${boardValue.boardId}`);
    };
    const handleCreateClick = (data) => {
        navigate(`/boards/${data}`);
    }

    const [modal, setModal] = useState(false);

    // 모달 창 open / close
    const openModal = () => setModal(true);
    const closeModal = () => setModal(false);

    return (
        <div key="boardList" className="boardList">
            <Title>Board List</Title>
            <BoardContainer>
                <BoardSpace>
                    <BoardWrapper>
                        <ListTitle>👍🏻 인기 게시판</ListTitle>
                        <div>
                            <PaginationButton onClick={() => handlePopularPageChange(popularPage - 1)} disabled={popularPage === 1}>〈</PaginationButton>
                            <PaginationButton onClick={() => handlePopularPageChange(popularPage + 1)} disabled={popularPage === 4 || popularPage === numPages}>〉</PaginationButton>
                        </div>
                    </BoardWrapper>
                    <BoardListWrapper>
                        {dataList.slice(popularOffset, popularOffset + limit).map(element => 
                            <Board key={element.id} onClick={() => handleBoardClick(element)}>
                                {element.name}
                            </Board>
                        )}
                    </BoardListWrapper>
                    <BoardWrapper>
                        <ListTitle>🎲 랜덤 게시판</ListTitle>
                        <div>
                            <PaginationButton onClick={() => handleRandomPageChange(randomPage - 1)} disabled={randomPage === 1}>〈</PaginationButton>
                            <PaginationButton onClick={() => handleRandomPageChange(randomPage + 1)} disabled={randomPage === 4 || randomPage === numPages}>〉</PaginationButton>
                        </div>
                    </BoardWrapper>
                    <BoardListWrapper>
                        {dataList.slice(randomOffset, randomOffset + limit).map(element => 
                            <Board key={element.id} onClick={() => handleBoardClick(element)}>
                                {element.name}
                            </Board>
                        )}
                    </BoardListWrapper>
                </BoardSpace>
                <BoardSpace>
                    <BoardWrapper>
                        <ListTitle>🗒️ 전체 게시판</ListTitle>
                        <div>
                            <PaginationButton onClick={() => handleAllPageChange(allPage - 1)} disabled={allPage === 1}>〈</PaginationButton>
                            <PaginationButton onClick={() => handleAllPageChange(allPage + 1)} disabled={allPage === 4 || allPage === allNumPages}>〉</PaginationButton>
                        </div>
                    </BoardWrapper>
                    <BoardListWrapper>
                        {boardList.slice(allOffset, allOffset + limit + 5).map(element =>
                            <Board key={element.boardId} onClick={() => handleBoardClick(element)}>
                                {element.private ? '🔓 ' : ''}{element.title}
                            </Board>
                        )}
                    </BoardListWrapper>
                </BoardSpace>
            </BoardContainer>
            <AddBoardButton src={add} alt="addBoard" onClick={() => handleCreateClick('create')} />
            {selectedPrivateValue.private && modal ?
                <PasswordModal boardValue={selectedPrivateValue} closeModal={closeModal}/>
            : ''}
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

const BoardWrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const ListTitle = styled.h4`
    position: relative;
    width: 190px;
    padding: 4px 6px;
    margin-bottom: 5px;
    text-align: left;
    font-weight: bold;
    border: none;
    border-bottom: 1px solid black;
`;

const PaginationButton = styled.button`
    position: relative;
    top: 22px;
    left: min(48%, 270px);
    background-color: white;
    border: 1px solid gray;
    border-radius: 3px;
`;

const BoardListWrapper = styled.ul`
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