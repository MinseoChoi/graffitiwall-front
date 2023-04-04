import styled from 'styled-components';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar/Sidebar';
import MyPage from './components/Sidebar/MyPage';
import { BoardList, CreateBoard, CreatePostit, Profile, Register, UserPostitList } from './pages'
import './css/Font.css';

const App = () => {
  return (
    <BrowserRouter>
      <AppContainer>
        <Header />
        <AppBody>
          <Sidebar />
          <AppMain>
            <Routes>
              <Route path="/" element={<BoardList />}></Route>
              <Route path="/boards/create" element={<CreateBoard />}></Route>
              <Route path="/boards/:boardId" element={<CreatePostit />}></Route>
              <Route path="/register" element={<Register />}></Route>
              <Route path="/users/:userId" element={<Profile />}></Route>
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