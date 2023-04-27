import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate  } from 'react-router-dom';
import styled from 'styled-components';
import { request } from '../../utils/api';

const BoardList = ({ closeSidebar }) => {
    // 게시판 목록 저장
    const [allBoardList, setAllBoardList] = useState([]);

    let sessionStorage = window.sessionStorage;
    const [flag, setFlag] = useState(false);

    useEffect(() => {
        const sessionSearch = sessionStorage.getItem('userRawId');

        const getAllBoardList = async () => {
            await request(`/users/${sessionSearch}/boards`)
            .then(json => setAllBoardList(json))
            .then(res => setFlag(true))
        };

        if (sessionSearch) {
            getAllBoardList();
        }
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
            {flag ?
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
                : <Notice>로그인이 필요한 서비스입니다.</Notice>
            }
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

const Notice = styled.div`
    position: relative;
    top: 70px;
    left: -40px;
    font-size: 15px;
    font-weight: bold;
`;