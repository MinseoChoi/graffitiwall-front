import styled from "styled-components";
import { useEffect, useState } from "react";
import { useNavigate  } from 'react-router-dom';
import { request } from "../utils/api.js";
import { BoardEditModal, PasswordModal } from "../components/Modal";
import { Title } from "../components/common/Title.js";

/* 유저가 생성한 게시판 목록 페이지 */
const UserBoardList = () => {
    // 게시판 목록 정보
    const [boardList, setBoardList] = useState([]);
    
    /* 페이지네이션 UI */
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

    // 비공개 게시판 정보
    const [selectedPrivateValue, setSelectedPrivateValue] = useState({
        private: false,
        boardId: 1,
        password: null
    });

    // 수정할 게시판 정보
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
            openPrivateModal();
            setSelectedPrivateValue({
                private: true,
                boardId: boardValue.boardId,
                password: boardValue.password
            });
            return;
        }
        navigate(`/boards/${boardValue.boardId}`);
    };

    // 수정 버튼 클릭 시, 선택한 게시판 정보 set
    const onEdit = element => {
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

    // 삭제 버튼 클릭 시, DB에서 해당 게시판 정보 삭제
    const onDelete = async (element) => {
        await request(`/boards/${element.boardId}`, {
            method: 'DELETE'
        });
    };

    /* ------ 모달 창 ------ */
    // 비공개 게시판 비밀번호 입력 모달 창 state(open/close)
    const [privateModal, setPrivateModal] = useState(false);

    // 비공개 게시판 비밀번호 입력 모달 창 state 변경 함수
    const openPrivateModal = () => setPrivateModal(true);
    const closePrivateModal = () => setPrivateModal(false);

    // 게시판 수정 모달 창 state(open/close)
    const [editModal, setEditModal] = useState(false);

    // 게시판 수정 모달 창 state 변경 함수
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
                    {/* 게시판 수정 모달 창 */}
                    {editModal ?
                        <BoardEditModal element={selectedBoardValue} closeModal={closeEditModal} />
                        : ''
                    }
                </BoardSpace>
            </BoardContainer>
            {/* 비공개 게시판 비밀번호 입력 모달 창 */}
            {selectedPrivateValue.private && privateModal ?
                <PasswordModal boardValue={selectedPrivateValue} closeModal={closePrivateModal}/>
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
    left: calc(1rem + 2vw);
    margin-right: calc(0.01rem + 10vw);
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
    left: calc(0.5rem + 0.9vw);
    width: calc(1rem + 29vw);
    text-align: left;
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
    font-size: calc(0.6rem + 0.3vw);

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