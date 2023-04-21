import '../../css/Sidebar.css';
import styled from 'styled-components';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm, MyPage, Favorites } from './';
import home from '../../assets/home.svg';
import user from '../../assets/user.svg';
import boardList from '../../assets/boardList.svg';
import back from '../../assets/back.svg';

/* 사이드바 */
const Sidebar = () => {
    // 사이드바 state(open/close, user/boardList)
    const [isOpen, setOpen] = useState(false);
    const [name, setName] = useState('');

    // 사이드바 state 변경 함수
    const toggle = (name) => {
        setOpen(!isOpen);
        setName(name);
    };

    // 메인 페이지로 라우팅
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/");
    }

    return (
        <div>
            <SidebarContainer>
                <Image src={home} alt="홈 화면" onClick={handleClick}/>
                <Image src={user} alt="로그인 또는 마이페이지" onClick={() => toggle("user")}/>
                <Image src={boardList} alt="게시판 즐겨찾기 리스트" onClick={() => toggle("boardList")}/>
            </SidebarContainer>
            <div className={isOpen ? 'open' : 'close'}>
                <Image top={-5} right={-200} boxShadow='none' src={back} alt="사이드바 닫기" onClick={() => toggle('')}/>
                {
                    name === 'user' ? <MyPage closeSidebar={toggle} /> : (name === 'boardList' ? <Favorites closeSidebar={toggle} /> : null)
                }
            </div>
        </div>
    );
};

export default Sidebar;

const SidebarContainer = styled.div`
    background-color: #B0D6B2;
    width: 52px;
    height: 100%;
    border-top-right-radius: 15px;
    overflow: auto;
`;

const Image = styled.img`
    position: relative;
    display: inline-block;
    top: ${props => props.top || 10}px;
    right: ${props => props.right || 0}px;
    width: 25px;
    height: 25px;
    padding: 8px;
    background-color: transparent;
    border-color: transparent;
    border-radius: 8px;

    &:hover {
        cursor: pointer;
        outline-color: transparent;
        outline-style: solid;
        box-shadow: ${props => props.boxShadow || '0 0 0 1px black'};
    }
`;

const OpenSidebar = styled.div`
    position: fixed;
    align-content: center;
    top: 15%;
    width: 238px;
    height: 100%;
    padding: 12px;
    background-color: #B0D7B2;
    border-top-right-radius: 15px;
    text-align: left;
    z-index: 100;
    animation: change 0.4s ease-in forwards;

    @keyframes change {
        from {
            left: -238px;
        }
        to {
            left: 0;
            visibility: visible;
        }
    }
`;