import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const AppHeader = styled.header`
    background-color: transparent;
    top: 0;
    height: 15%;
    font-size: calc(1rem + 2vw);
    font-family: "Last Ninja", Impact, fantasy;
    text-shadow: 4px 2px 2px gray;
    display: flex;
    justify-content: center;
    align-items: center;
    color: black;
`;

const H1 = styled.h1`
    cursor: pointer;
`;

const Header = () => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/");
    };
    
    return (
        <AppHeader>
            <H1 onClick={handleClick}>
                Graffiti Wall
            </H1>
        </AppHeader>
    );
};

export default Header;