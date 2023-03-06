import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import home from '../../image/home.svg';
import user from '../../image/user.svg';
import boardList from '../../image/boardList.svg';
import back from '../../image/back.svg';
import './Sidebar.css';
import LoginForm from '../form/LoginForm';
import BoardList from '../boardList/BoardList';

const Sidebar = () => {
    // const [isOpen, setOpen] = useState(false);
    // const [xPosition, setX] = useState(width);
    // const side = useRef();

    // const toggleUser = () => {
    //     if (xPosition > 0) {
    //         setX(0);
    //         setOpen(true);
    //     } else {
    //         setX(width);
    //         setOpen(false);
    //     }
    // };

    // const handleClose = async e => {
    //     let sideArea = side.current;
    //     let sideChildren = side.current.contains(e.target);
    //     if (isOpen && (!sideArea || !sideChildren)) {
    //         await setX(width);
    //         await setOpen(false);
    //     }
    // };

    // useEffect(() => {
    //     window.addEventListener('click', handleClose);
    //     return () => {
    //         window.removeEventListener('click', handleClose);
    //     };
    // });

    const [isOpen, setOpen] = useState(false);
    const [name, setName] = useState('');
    const side = useRef();

    useEffect(() => {

    })
    const toggleUser = (name) => {
        setOpen(!isOpen);
        setName(name);
    };

    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/");
    }

    return (
        <div>
            <div className="sidebar">
                <button className="homebutton" onClick={handleClick}>
                    <img src={home} alt="home" />
                </button>
                <button className="userbutton" onClick={() => toggleUser("user")}>
                    <img src={user} alt="user" />
                </button>
                <button className="boardListbutton" onClick={() => toggleUser("boardList")}>
                    <img src={boardList} alt="boardList" />
                </button>
            </div>
            <div className={isOpen ? 'open' : 'close'}>
                <button className="closebutton" onClick={() => {
                    setOpen(!isOpen);
                    setName('');
                }}>
                    <img src={back} alt="close" />
                </button>
                {
                    name === 'user' ? <LoginForm /> : (name === 'boardList' ? <BoardList /> : null)
                }
                {/* <div className={content}>{children}</div> */}
            </div>
        </div>
    );
};

export default Sidebar;