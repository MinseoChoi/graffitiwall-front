import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

/* 사이드바 - 마이페이지 */
const MyPage = ({ userData, closeSidebar, logout }) => {
    // 클릭한 버튼에 해당하는 url로 라우팅
    const navigate = useNavigate();
    const handleClick = (url) => {
        closeSidebar('');
        navigate(`${url}`);
    };

    return (
        <MyPageContainer>
            <MyPageTitle>{userData.nickname} 님 마이페이지</MyPageTitle>
            <MyPageWrapper>
                <MyPageButton onClick={() => handleClick(`/users/${userData.id}`)}>내 프로필</MyPageButton>
                <MyPageButton onClick={() => handleClick('/boards/create')}>✚ 게시판 생성</MyPageButton>
                <MyPageButton onClick={() => handleClick(`/users/${userData.id}/boards`)}>🪧 생성한 게시판 목록</MyPageButton>
                <MyPageButton onClick={() => handleClick(`/users/${userData.id}/postits`)}>📝 작성한 포스트잇 목록</MyPageButton>
                <MyPageButton marginTop={30} backgroundColor='white' hoverBackgroundColor='black' hoverColor='white' onClick={logout}>↩︎ Log out</MyPageButton>
            </MyPageWrapper>
        </MyPageContainer>
    );
};

export default MyPage;

const MyPageContainer = styled.div`
    position: relative;
    justify-content: center;
    align-items: center;
`;

const MyPageTitle = styled.p`
    position: absolute;
    top: -50px;
    font-size: 15px;
    font-weight: bold;
    text-decoration: underline;
`;

const MyPageWrapper = styled.div`
    position: absolute;
    justify-content: center;
    align-items: center;
`

const MyPageButton = styled.button`
    display: block;
    width: 200px;
    height: 30px;
    margin-top: ${props => props.marginTop || 10}px;
    margin-left: 18px;
    margin-bottom: 12px;
    border-color: transparent;
    border-radius: 5px;
    background-color: ${props => props.backgroundColor || '#DEF7FF'};
    font-size: 12px;
    font-weight: bold;
    box-sizing: border-box;
    cursor: pointer;

    &:hover {
        outline-color: transparent;
        outline-style: bold;
        border: none;
        background-color: ${props => props.hoverBackgroundColor || 'white'};
        color: ${props => props.hoverColor || 'black'};
    }
`;