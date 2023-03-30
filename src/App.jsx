import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import Header from './Component/Header';
import Sidebar from './Component/Sidebar/Sidebar';
import {BoardList, CreateBoard,CreatePostit,Profile,Register} from './Component/Page'

const App = () => {
  // const [boardList, setBoardList] = useState({});

  // const getData = async () => {
  //   let response = await fetch(('http://52.78.90.15/api/v1/boards/1'))
  //   return response.json;
  // }

  // let res = getData();

  // res.then(data => {
  //   setBoardList({...boardList, data});
  //   console.log(boardList);
  // })
  // useEffect(() => {
  //   let res = getData();

  //   res.then(json => { 
  //     setBoardList({json});
  //     console.log(json);
  //   });
  //   // fetch('http://52.78.90.15/api/v1/boards/1')
  //   // .then(response => response.json())
  //   // .then(json => {setBoardList({...boardList, json}); console.log(boardList)})
  //   // .catch(error => console.log('error ', error));
  //   // fetch('http://52.78.90.15/api/v1/boards/2')
  //   // .then(response => response.json())
  //   // .then(json => {setBoardList({...boardList, json}); console.log(boardList)})
  //   // .catch(error => console.log('error ', error));
  // }, []);

  return (
    <BrowserRouter>
      <AppContainer className="App">
        <Header />
        <AppBody className="AppBody">
          <Sidebar />
          <AppMain className="main">
            <Routes>
              <Route path="/" element={<BoardList />}></Route>
              <Route path="/boards/create" element={<CreateBoard />}></Route>
              <Route path="/boards/:boardId" element={<CreatePostit />}></Route>
              <Route path="/register" element={<Register />}></Route>
              <Route path="/users/:userId" element={<Profile />}></Route>
              <Route path="/users/:userId/postits" element={<Profile />}></Route>
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