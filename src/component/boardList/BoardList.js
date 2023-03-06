import './BoardList.css';
// import { useNavigate  } from 'react-router-dom';

const BoardList = () => {
    const data = [
        {
            name: 'board1'
        },
        {
            name: 'board2'
        },
        {
            name: 'board3'
        },
        {
            name: 'board4'
        },
        {
            name: 'board5'
        },
    ];

    // const navigate = useNavigate();
    // const handleClick = (boardName) => {
    //     navigate(`/${boardName}`);
    // }

    return (
        <div className="boardList">
            <p>Board List</p>
            <ul>
                {data.map(element =>
                    <li key={element.name}>
                        {element.name}
                    </li>
                )}
            </ul>
        </div>
    );
};

export default BoardList;