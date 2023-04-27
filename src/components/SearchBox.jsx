import styled from "styled-components";
import { BiSearchAlt } from 'react-icons/bi';
import { useState } from "react";
import { useEffect } from "react";

export const SearchBox = ({ name, keyword, onChangeKeyword }) => {
    const [placeholder, setPlaceholder] = useState('');

    useEffect(() => {
        if (name === '게시판') {
            setPlaceholder('게시판의 이름을 입력해주세요.');
        } else {
            setPlaceholder('포스트잇의 제목이나 내용을 입력해주세요.');
        }
    }, []);
    
    return (
        <Container>
            <Wrapper>
                <ImgBox>
                    <BiSearchAlt size={20} />
                </ImgBox>
                <Input placeholder={placeholder} value={keyword} onChange={onChangeKeyword} />
            </Wrapper>
        </Container>  
    );
};

const Container = styled.div`
  width: 100%;
  height: 0;
  margin-top: 10px;
`;

const Wrapper = styled.div`
  position: fixed;
  display: flex;
  width: 25%;
  top: 150px;
  left: calc(2rem + 70vw);
  gap: 8px;
  background-color: white;
  border: 1px solid gray;
  border-radius: 20px;
  overflow: hidden;
  max-width: 60%;
  margin: 0 auto;
  box-shadow: 0 2px 4px rgba(250, 250, 250, 0.24);
`;

const Input = styled.input`
  width: 100%;
  display: block;
  padding: 8px 20px;
  padding-left: 38px;
  border: 0;
  outline: 0;
  font-size: 11px;
`;

const ImgBox = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 10px;
  display: flex;
  align-items: center;
  svg {
    fill: black;
  }
`;