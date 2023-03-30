import { useNavigate  } from 'react-router-dom';
import styled from 'styled-components';

const BoardList = ({ closeSidebar }) => {
    const data = [
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
        },
        {
            id: 11,
            name: 'board11'
        },
        {
            id: 12,
            name: 'board12'
        },
        {
            id: 13,
            name: 'board13'
        },
        {
            id: 14,
            name: 'board14'
        },
        {
            id: 15,
            name: 'board15'
        },
        {
            id: 16,
            name: 'board16'
        },
        {
            id: 17,
            name: 'board17'
        },
        {
            id: 18,
            name: 'board18'
        },
        {
            id: 19,
            name: 'board19'
        },
        {
            id: 20,
            name: 'board20'
        }
    ];

    const navigate = useNavigate();
    const handleClick = (boardName) => {
        closeSidebar('');
        navigate(`/boards/${boardName}`);
    }

    return (
        /* 사이드바 즐겨찾기 영역 */
        <BoardListContainer className="boardList">
            <BoardListTitle>Favorites</BoardListTitle>
            <BoardWrapper>
                <ScrollBlind>
                    <BoardUl>
                        {data.map(element =>
                            <Board key={element.id} onClick={() => handleClick(element.id)}>
                                {element.name}
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

    &:hover {
        cursor: pointer;
        font-weight: bold;
        letter-spacing: 5px;
    }
`;