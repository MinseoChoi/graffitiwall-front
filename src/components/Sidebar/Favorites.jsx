import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate  } from 'react-router-dom';
import styled from 'styled-components';
import { request } from '../../utils/api';

const BoardList = ({ closeSidebar }) => {
    // 게시판 목록 저장
    const [allBoardList, setAllBoardList] = useState([]);

    useEffect(() => {
        const getAllBoardList = async () => {
            await request('/boards')
            .then(json => setAllBoardList(json))
        };
        getAllBoardList();
    }, []);

    const navigate = useNavigate();
    const handleClick = (boardName) => {
        closeSidebar('');
        navigate(`/boards/${boardName}`);
    }

    return (
        /* 사이드바 즐겨찾기 영역 */
        <BoardListContainer>
            <BoardListTitle>⭐︎ Favorites</BoardListTitle>
            <BoardWrapper>
                <ScrollBlind>
                    <BoardUl>
                        {allBoardList.map(element =>
                            <Board key={element.boardId} onClick={() => handleClick(element.boardId)}>
                                {element.title}
                            </Board>
                        )}
                    </BoardUl>
                </ScrollBlind>
            </BoardWrapper>
        </BoardListContainer>
    );
};

export default BoardList;

const BoardListContainer = styled.div`
    position: absolute;
    top: 5%;
    left: 80px;
`;

const BoardListTitle = styled.p`
    position: absolute;
    left: -55px;
    width: 200px;
    text-align: left;
    font-size: 20px;
    font-weight: bold;
    border: none;
    border-bottom: 1px solid black;
`;

const BoardWrapper = styled.div`
    position: absolute;
    top: 40px;
    left: -80px;
    width: 200px;
    overflow: hidden;
`;

const ScrollBlind = styled.div`
    width: 230px;
`;

const BoardUl = styled.ul`
    width: 200px;
    height: 500px;
    overflow-y: scroll;
`;

const Board = styled.li`
    display: block;
    padding-bottom: 6px;
    margin-bottom: 6px;
    list-style-type: none;
    transition: all 0.3s;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

    &:hover {
        cursor: pointer;
        font-weight: bold;
        letter-spacing: 5px;
    }
`;