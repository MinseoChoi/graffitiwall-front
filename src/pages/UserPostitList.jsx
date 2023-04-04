import styled from "styled-components";
import { Title } from "../components/common";
import bin from '../assets/bin.svg';

const UserPostitList = () => {
    // 유저의 포스트잇 목록을 불러와 격자 형태로 화면에 출력
    // 수정 => 클릭하면 모달 창으로?
    // 삭제 => 휴지통으로 드래그 앤 드롭 해서?
    // 추후 가능하다면, 검색 기능
    return (
        <div>
            <Title>Postit List</Title>
            <PostitContainer>
                aaa
                {/* 유저가 쓴 포스트잇 불러와서 출력 */}
            </PostitContainer>
            <DeletePostitButton src={bin} alt="DeletePostit" onClick={() => alert('delete!')} />
        </div>
    );
};

export default UserPostitList;

const PostitContainer = styled.div`
    display: grid;
    position: absolute;
    left: 80px;
    background-color: gray;
    width: 80vw;
    height: 550px;
`;

const DeletePostitButton = styled.img`
    position: fixed;
    display: inline-block;
    bottom: 15px;
    right: 25px;
    width: 50px;
    height: 50px;
    background-color: transparent;
    border: none;
    border-radius: 8px;
    transition: 0.8s ease;
    overflow: hidden;

    &:hover {
        cursor: pointer;
        outline-color: transparent;
        outline-style: solid;
        box-shadow: 0 0 0 1px black;
    }
`;