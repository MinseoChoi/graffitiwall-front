import styled from "styled-components";
import { useEffect, useState } from "react";
import { useNavigate  } from 'react-router-dom';
import FadeLoader from 'react-spinners/FadeLoader';
import { request } from "../utils/api.js";
import PasswordModal from "../components/Modal/PasswordModal.jsx";
import { Title } from "../components/common/Title.js";
import { SearchBox } from "../components/SearchBox.jsx";

/* 메인 페이지 - 전체 게시판 & 조회수가 높은 게시판 & 랜덤 게시판 */
const BoardList = () => {
    // 로딩 state
    const [loading, setLoading] = useState(true);

    // 게시판 목록 저장
    const [allBoardList, setAllBoardList] = useState([]);
    const [popularBoardList, setPopularBoardList] = useState([]);
    const [randomBoardList, setRandomBoardList] = useState([]);
    
    /* ------ 페이지네이션 UI ------ */
    const [limit, setLimit] = useState(5);
    const [popularPage, setPopularPage] = useState(1);
    const [randomPage, setRandomPage] = useState(1);
    const [allPage, setAllPage] = useState(1);
    const popularOffset = (popularPage - 1) * limit;
    const randomOffset = (randomPage - 1) * limit;
    const allOffset = (allPage - 1) * (limit + 5);
    const popularNumPages = Math.ceil(popularBoardList.length / limit);
    const randomNumPages = Math.ceil(randomBoardList.length / limit);
    const allNumPages = Math.ceil(allBoardList.length / (limit + 5));

    const handlePopularPageChange = page => {
        setPopularPage(page);
    };

    const handleRandomPageChange = page => {
        setRandomPage(page);
    };

    const handleAllPageChange = page => {
        setAllPage(page);
    };

    const [keyword, setKeyword] = useState('');

    const onChangeKeyword = e => {
        setKeyword(e.target.value);
    };

    // GET 메소드로 전체 게시판 목록 가져오기
    useEffect(() => {
        const getPopularBoardList = async () => {
            await request('/boards/popular')
            .then(json => setPopularBoardList(json))
        };
        getPopularBoardList();

        const getRandomBoardList = async () => {
            await request('/boards/random')
            .then(json => setRandomBoardList(json))
        };
        getRandomBoardList();

        const getAllBoardList = async () => {
            await request('/boards')
            .then(json => setAllBoardList(json))
            .then(res => setLoading(false))
        };
        getAllBoardList();
    }, []);

    // 비공개 게시판 정보
    const [selectedPrivateValue, setSelectedPrivateValue] = useState({
        private: false,
        boardId: 1,
        password: null
    });

    /* ------ 모달 창 ------ */
    // 모달 창 state(open/close)
    const [modal, setModal] = useState(false);

    // 모달 창 state 변경 함수
    const openModal = () => setModal(true);
    const closeModal = () => setModal(false);

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
        }
        navigate(`/boards/${boardValue.boardId}`);
    };

    return (
        <div key="boardList" className="boardList">
            <Title>Board List</Title>
            <SearchBox name='게시판' keyword={keyword} onChangeKeyword={onChangeKeyword} />
            {keyword ? <AutoSearchContainer>
                <AutoSearchWrap>
                    {allBoardList.filter(element => element.title.toLowerCase().includes(keyword.toLowerCase()))
                    .map(element =>
                        <AutoSearchData key={element.boardId} onClick={() => handleBoardClick(element)}>
                            {element.private ? '🔓 ' : ''}{element.title}
                        </AutoSearchData>
                    )}
                </AutoSearchWrap>
            </AutoSearchContainer>
            : null}
            <BoardContainer>
                <BoardSpace>
                    {/* 인기 게시판 목록 */}
                    <BoardWrapper>
                        <ListTitle>👍🏻 인기 게시판</ListTitle>
                        <div>
                            <PaginationButton onClick={() => handlePopularPageChange(popularPage - 1)} disabled={popularPage === 1}>〈</PaginationButton>
                            <PaginationButton onClick={() => handlePopularPageChange(popularPage + 1)} disabled={popularPage === popularNumPages || popularNumPages === 0}>〉</PaginationButton>
                        </div>
                    </BoardWrapper>
                    <BoardListWrapper height={23}>
                        {popularBoardList.slice(popularOffset, popularOffset + limit).map(element => 
                            <Board key={element.boardId} onClick={() => handleBoardClick(element)}>
                                {element.private ? '🔓 ' : ''}{element.title}
                            </Board>
                        )}
                    </BoardListWrapper>
                    {/* 랜덤 게시판 목록 */}
                    <BoardWrapper>
                        <ListTitle>🎲 랜덤 게시판</ListTitle>
                        <div>
                            <PaginationButton onClick={() => handleRandomPageChange(randomPage - 1)} disabled={randomPage === 1}>〈</PaginationButton>
                            <PaginationButton onClick={() => handleRandomPageChange(randomPage + 1)} disabled={randomPage === randomNumPages || randomNumPages === 0}>〉</PaginationButton>
                        </div>
                    </BoardWrapper>
                    <BoardListWrapper height={23}>
                        {randomBoardList.slice(randomOffset, randomOffset + limit).map(element => 
                            <Board key={element.boardId} onClick={() => handleBoardClick(element)}>
                                {element.private ? '🔓 ' : ''}{element.title}
                            </Board>
                        )}
                    </BoardListWrapper>
                </BoardSpace>
                {/* 전체 게시판 목록 */}
                <BoardSpace>
                    <BoardWrapper>
                        <ListTitle>🗒️ 전체 게시판</ListTitle>
                        <div>
                            <PaginationButton onClick={() => handleAllPageChange(allPage - 1)} disabled={allPage === 1}>〈</PaginationButton>
                            <PaginationButton onClick={() => handleAllPageChange(allPage + 1)} disabled={allPage === allNumPages || allNumPages === 0}>〉</PaginationButton>
                        </div>
                    </BoardWrapper>
                    <BoardListWrapper height={46}>
                        {loading ? <LoadingWrapper>
                            <FadeLoader radius={2} height={15} width={5} color="#B0D6B2" />
                        </LoadingWrapper>
                        : allBoardList.slice(allOffset, allOffset + limit + 5).map(element =>
                            <Board key={element.boardId} onClick={() => handleBoardClick(element)}>
                                {element.private ? '🔓 ' : ''}{element.title}
                            </Board>
                        )}
                    </BoardListWrapper>
                </BoardSpace>
            </BoardContainer>
            {/* 비공개 게시판 비밀번호 입력 모달 창 */}
            {selectedPrivateValue.private && modal ?
                <PasswordModal boardValue={selectedPrivateValue} closeModal={closeModal}/>
            : ''}
        </div>
    );
};

export default BoardList;

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
    left: calc(0.05rem + 6vw);
    margin-right: calc(0.01rem + 15vw);
`;

const BoardWrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const ListTitle = styled.h4`
    position: relative;
    width: calc(1rem + 20vw);
    padding: 4px 6px;
    margin-bottom: 5px;
    text-align: left;
    font-size: calc(0.5rem + 0.55vw);
    font-weight: bold;
    border: none;
    border-bottom: 1px solid black;
`;

const PaginationButton = styled.button`
    position: relative;
    top: 22px;
    left: calc(0.1rem + 0.9vw);
    background-color: white;
    border: 1px solid gray;
    border-radius: 3px;
`;

const LoadingWrapper = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

const BoardListWrapper = styled.ul`
    position: relative;
    left: calc(0.01rem + 1vw);
    width: calc(0.01rem + 26vw);
    height: ${props => props.height}vh;
    text-align: left;
    background-color: #DDDDDD;
    border-radius: 5px;
    box-shadow: 5px 5px 3px rgb(0, 0, 0, 0.06);
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
    font-size: calc(0.9rem + 0.01vw);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
        cursor: pointer;
        font-weight: bold;
    }
`;


const AutoSearchContainer = styled.div`
    z-index: 3;
    height: fit-content;
    width: 25%;
    max-width: 60%;
    margin: 0 auto;
    left: calc(2rem + 70vw);
    background-color: #fff;
    position: fixed;
    top: 181px;
    border: 1px solid gray;
    border-radius: 5px;
`;

const AutoSearchWrap = styled.ul`
    width: 80%;
    text-align: left;
`;

const AutoSearchData = styled.li`
    width: 100%;
    font-size: 10px;
    border-bottom: 1px solid black;
    margin-bottom: 8px;
    z-index: 4;
    letter-spacing: 2px;
    list-style-type: none;

    &:hover {
        background-color: #edf5f5;
        cursor: pointer;
        font-weight: bold;
    }
    position: relative;
`;