import styled from "styled-components";
import { useEffect, useState } from "react";
import { useNavigate  } from 'react-router-dom';
import { request } from "../utils/api.js";
import { BoardEditModal, PasswordModal } from "../components/Modal";
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

    const [selectedBoardValue, setSelectedBoardValue] = useState({
        boardId: 1,
        title: '',
        category: '',
        isPrivate: false,
        password: null,
        userId: 1,
    })

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

    const onEdit = element => {
        console.log(element);
        setSelectedBoardValue({
            boardId: element.boardId,
            title: element.title,
            category: element.category,
            isPrivate: element.private,
            password: element.password,
            userId: element.userId
        })
        openEditModal();
    }

    const onDelete = async (element) => {
        await request(`/boards/${element.boardId}`, {
            method: 'DELETE'
        });
    };

    const [modal, setModal] = useState(false);

    // 모달 창 open / close
    const openModal = () => setModal(true);
    const closeModal = () => setModal(false);

    const [editModal, setEditModal] = useState(false);

    const openEditModal = () => setEditModal(true);
    const closeEditModal = () => setEditModal(false);

    return (
        <div key="boardList" className="boardList">
            <Title>Board List</Title>
            <BoardContainer>
                <BoardSpace>
                    <div>
                        <PaginationButton onClick={() => handleAllPageChange(allPage - 1)} disabled={allPage === 1}>〈</PaginationButton>
                        <PaginationButton onClick={() => handleAllPageChange(allPage + 1)} disabled={allPage === allNumPages}>〉</PaginationButton>
                    </div>
                    <BoardListWrapper>
                        {boardList.slice(allOffset, allOffset + limit).map(element =>
                            <BoardList key={element.boardId}>
                                <Board onClick={() => handleBoardClick(element)}>
                                    {element.private ? '🔓 ' : ''}{element.title}
                                </Board>
                                <div>
                                    <BoardButton onClick={() => onEdit(element)}>✏️</BoardButton>
                                    <BoardButton onClick={() => onDelete(element)}>🗑️</BoardButton>
                                </div>
                            </BoardList>
                        )}
                    </BoardListWrapper>
                </BoardSpace>
                <BoardSpace>
                    {editModal ?
                        <BoardEditModal element={selectedBoardValue} closeModal={closeEditModal} />
                        : ''
                    }
                </BoardSpace>
            </BoardContainer>
            {selectedPrivateValue.private && modal ?
                <PasswordModal boardValue={selectedPrivateValue} closeModal={closeModal}/>
            : ''}
        </div>
    );
};

export default UserBoardList;

const BoardContainer = styled.div`
    position: absolute;
    display: flex;
    flex-direction: row;
    top: 190px;
    width: 80%;
    height: 70vh;
`;

const BoardSpace = styled.div`
    position: relative;
    top: -10px;
    left: 50px;
    margin-right: 120px;
`;

const PaginationButton = styled.button`
    position: relative;
    top: 20px;
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
    box-shadow: 5px 5px 3px rgb(0, 0, 0, 0.06);
    overflow: auto;
`;

const BoardList = styled.li`
    display: flex;
    justify-content: space-between;
    padding-bottom: 6px;
    margin-top: 10px;
    margin-left: -20px;
    margin-right: 20px;
    margin-bottom: 6px;
    border-bottom: 1px solid white;
    list-style-type: none;

    &:hover {
        font-weight: bold;
    }
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