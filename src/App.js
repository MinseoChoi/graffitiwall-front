import './App.css';
import Header from './component/header/Header';
import Sidebar from './component/sidebar/Sidebar';
import CreatePostit from './component/createPostit/CreatePostit';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <div className="App-body">
          <Sidebar />
          <div className="main">
            <Routes>
              <Route path="/" element={<CreatePostit />}></Route>
              <Route path="/board/:boardId" element={<CreatePostit />}></Route>
            </Routes>
          </div> 
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App;