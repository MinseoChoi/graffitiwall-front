import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar/Sidebar';
import { BoardList, CreateBoard, CreatePostit, Profile, Register, UserBoardList, UserPostitList } from './pages'
import './css/Font.css';
import { request } from './utils/api';

const App = () => {
  const [user, setUser] = useState(null);
  const authenticated = user != null;

  let sessionStorage = window.sessionStorage;

  useEffect(() => {
    const sessionSearch = sessionStorage.getItem('userRawId');
    
    const getUserData = async () => {
      await request(`/users/${sessionSearch}`)
      .then(json => setUser(json))
    };

    if (sessionSearch) {
      getUserData();
    }
  }, []);

  const login = async ({ userId, password }) => {
    await fetch('http://52.78.90.15/api/v1/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, password })
    })
    .then(res => res.json())
    .then(json => {
        setUser(json);
        sessionStorage.setItem('userRawId', json.id);
    })
    .catch(e => alert('아이디 또는 비밀번호를 잘못 입력하였습니다.'));
  }

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('userRawId');
  };

  return (
    <BrowserRouter>
      <AppContainer>
        <Header />
        <AppBody>
          <Sidebar authenticated={authenticated} login={login} userData={user} logout={logout} />
          <AppMain>
            <Routes>
              <Route path="/" element={<BoardList />}></Route>
              <Route path="/boards/create" element={<CreateBoard />}></Route>
              <Route path="/boards/:boardId" element={<CreatePostit />}></Route>
              <Route path="/register" element={<Register />}></Route>
              <Route path="/users/:userId" element={<Profile />}></Route>
              <Route path="/users/:userId/boards" element={<UserBoardList />}></Route>
              <Route path="/users/:userId/postits" element={<UserPostitList />}></Route>
            </Routes>
          </AppMain>
        </AppBody>
      </AppContainer>
    </BrowserRouter>
  )
}

export default App;

const AppContainer = styled.div`
  text-align: center;
  width: 100vw;
  height: 100vh;
`;

const AppBody = styled.div`
  width: 100vw;
  height: 85%;
  display: flex;
  justify-content: flex-start;
`;

const AppMain = styled.div`
  display: block;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100%;
  text-align: center;
  overflow: auto;
`;