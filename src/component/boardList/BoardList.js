import './BoardList.css';
import { useNavigate  } from 'react-router-dom';

const BoardList = () => {
    const data = [
        {
            id: '1',
            name: 'board1'
        },
        {
            id: '2',
            name: 'board2'
        },
        {
            id: '3',
            name: 'board3'
        },
        {
            id: '4',
            name: 'board4'
        },
        {
            id: '5',
            name: 'board5'
        },
    ];
    
    const navigate = useNavigate();
    const handleClick = (boardName) => {
        navigate(`/board/${boardName}`);
    }

    return (
        <div className="boardList">
            <p>Board List</p>
            <ul>
                {data.map(element =>
                    <li key={element.id} onClick={() => handleClick(element.id)}>
                        {element.name}
                    </li>
                )}
            </ul>
        </div>
    );
};

export default BoardList;