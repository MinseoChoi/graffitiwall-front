import './Header.css';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/");
    }
    return (
        <header className="App-header">
            <h1 onClick={handleClick} style={{cursor: 'pointer'}}>
                Grafitti Wall
            </h1>
        </header>
    );
};

export default Header;