import styled from "styled-components";
import { useEffect, useState } from "react";
import { useNavigate  } from 'react-router-dom';
import { request } from "../utils/api.js";
import PasswordModal from "../components/Modal/PasswordModal.jsx";
import { Title } from "../components/common/Title.js";

/* 각 유저가 생성한 게시판 목록 */
const UserBoardList = () => {
    // 게시판 목록 저장
    const [boardList, setBoardList] = useState([]);
    
    // 페이지네이션 -> 코드 간소화 필요
    const [limit, setLimit] = useState(10);
    const [allPage, setAllPage] = useState(1);
    const allOffset = (allPage - 1) * limit;
    const allNumPages = Math.ceil(boardList.length / limit);

    const handleAllPageChange = page => {
        setAllPage(page);
    };

    // GET 메소드로 유저가 생성한 게시판 목록 가져오기
    useEffect(() => {
        const getAllBoardList = async () => {
            await request(`/users/1/boards`)
            .then(json => setBoardList(json))
        };
        getAllBoardList();
    }, [boardList]);

    const [selectedPrivateValue, setSelectedPrivateValue] = useState({
        private: false,
        boardId: 1,
        password: null
    });

    // 선택한 게시판 url로 라우팅
    const navigate = useNavigate();
    const handleBoardClick = (boardValue) => {
        if (boardValue.private === true) {
            openModal();
            setSelectedPrivateValue({
                private: true,
                boardId: boardValue.boardId,
                password: boardValue.password
            });
            return;
        }
        navigate(`/boards/${boardValue.boardId}`);
    };

    const onEdit = async (element) => {

    };

    const onDelete = async (element) => {
        await request(`/boards/${element.boardId}`, {
            method: 'DELETE'
        });
    };

    const [modal, setModal] = useState(false);

    // 모달 창 open / close
    const openModal = () => setModal(true);
    const closeModal = () => setModal(false);

    return (
        <div key="boardList" className="boardList">
            <Title>Board List</Title>
            <BoardContainer>
                <BoardWrapper>
                    <PaginationButton onClick={() => handleAllPageChange(allPage - 1)} disabled={allPage === 1}>〈</PaginationButton>
                    <PaginationButton onClick={() => handleAllPageChange(allPage + 1)} disabled={allPage === 4 || allPage === allNumPages}>〉</PaginationButton>
                </BoardWrapper>
                <BoardListWrapper>
                    {boardList.slice(allOffset, allOffset + limit + 5).map(element =>
                        <BoardSpace key={element.boardId}>
                            <Board onClick={() => handleBoardClick(element)}>
                                {element.private ? '🔓 ' : ''}{element.title}
                            </Board>
                            <div>
                                <BoardButton onClick={() => alert('edit')}>✏️</BoardButton>
                                <BoardButton onClick={() => onDelete(element)}>🗑️</BoardButton>
                            </div>
                        </BoardSpace>
                    )}
                </BoardListWrapper>
            </BoardContainer>
            {selectedPrivateValue.private && modal ?
                <PasswordModal boardValue={selectedPrivateValue} closeModal={closeModal}/>
            : ''}
        </div>
    );
};

export default UserBoardList;

const BoardContainer = styled.div`
    position: relative;
    top: 60px;
    left: 35px;
    margin-right: 120px;
`;

const BoardWrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    left: -259px;
`;

const PaginationButton = styled.button`
    position: relative;
    top: 20px;
    left: min(48%, 270px);
    background-color: white;
    border: 1px solid gray;
    border-radius: 3px;
`;

const BoardListWrapper = styled.ul`
    position: relative;
    top: 25px;
    left: 10px;
    width: 35vw;
    text-align: left;
    font-size: 13px;
    background-color: #DDDDDD;
    border-radius: 5px;
    overflow: auto;
`;

const BoardSpace = styled.li`
    display: flex;
    justify-content: space-between;
    padding-bottom: 6px;
    margin-top: 10px;
    margin-left: -20px;
    margin-right: 20px;
    margin-bottom: 6px;
    border-bottom: 1px solid white;
    list-style-type: none;
`;

const Board = styled.div`
    position: relative;

    &:hover {
        cursor: pointer;
        font-weight: bold;
    }
`;

const BoardButton = styled.button`
    position: relative;
    background-color: transparent;
    border: none;
    border-radius: 4px;

    &:hover {
        cursor: pointer;
        box-shadow: 0 0 0 1px white;
    }
`;