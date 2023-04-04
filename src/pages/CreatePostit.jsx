import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Draggable from 'react-draggable';
import Modal from '../components/Modal/Modal';
import add from '../assets/addPostit.svg';
import { Title } from '../components/common/Title.js';
import { request } from '../utils/api';

const CreatePostit = () => {
    // const containerRef = useRef(null);
    // const dragComponentRef = useRef(null);
    // const [originPos, setOriginPos] = useState({ x: 0, y: 0 });
    // const [clientPos, setClientPos] = useState({ x: 0, y: 0 });
    // const [pos, setPos] = useState({ left: 0, top: 0 });

    // const dragStartHandler = (e) => {
    //     const blankCanvas = document.createElement('canvas')
    //     blankCanvas.classList.add("canvas");
    //     e.dataTransfer?.setDragImage(blankCanvas, 0, 0);
    //     document.body?.appendChild(blankCanvas); // 투명 캔버스를 생성하여 글로벌 아이콘 제거
    //     e.dataTransfer.effectAllowed = "move"; // 크롬의그린 +아이콘 제거
    //     const originPosTemp = { ...originPos };
    //     originPosTemp["x"] = e.target.offsetLeft;
    //     originPosTemp["y"] = e.target.offsetTop;
    //     console.log("originPosTemp", originPosTemp);
    //     setOriginPos(originPosTemp); //드래그 시작할때 드래그 전 위치값을 저장

    //     const clientPosTemp = { ...clientPos };
    //     clientPosTemp["x"] = e.clientX;
    //     clientPosTemp["y"] = e.clientY;
    //     setClientPos(clientPosTemp);
    // };

    // const dragHandler = (e) => {
    //     const PosTemp = { ...pos };
        // PosTemp["left"] = e.target.offsetLeft + e.clientX - clientPos.x;
    //     PosTemp["top"] = e.target.offsetTop + e.clientY - clientPos.y;
    //     setPos(PosTemp);

    //     const clientPosTemp = { ...clientPos };
    //     clientPosTemp["x"] = e.clientX;
    //     clientPosTemp["y"] = e.clientY;
    //     setClientPos(clientPosTemp);
    // };

    // const dragOverHandler = (e) => {
    //     e.preventDefault(); // 드래그시에 플라잉백하는 고스트이미지를 제거한다
    // };

    // const dragEndHandler = (e) => {
    //     if (!isInsideDragArea(e)) {
    //         const posTemp = { ...pos };
    //         posTemp["left"] = originPos.x;
    //         posTemp["top"] = originPos.y;
    //         setPos(posTemp);
    //     }
    //     // 캔버스 제거
    //     const canvases = document.getElementsByClassName("canvas");
    //     for (let i = 0; i < canvases.length; i++) {
    //         let canvas = canvases[i];
    //         canvas.parentNode?.removeChild(canvas);
    //     }
    //     // 캔버스로 인해 발생한 스크롤 방지 어트리뷰트 제거
    //     document.body.removeAttribute("style");
    // };

    // const isInsideDragArea = (e) => {
    //     return true;
    // }

    // 게시판 정보 ( 게시판 ID, 제목 )
    const [boardData, setBoardData] = useState({
        boardId: 1,
        title: ''
    });

    // url에서 게시판 ID 가져오기
    const {boardId} = useParams();

    useEffect(() => {
        // GET 메소드로 게시판 정보(게시판 ID, 게시판 제목) 가져오기
        const getBoardName = async () => {
            await request(`/boards/${boardId}`)
            .then(json => setBoardData({ boardId: json.boardId, title: json.title}))
        };
        getBoardName();
    }, );
 
    const nodeRef = useRef();

    // 포스트잇 리스트
    const [postitListValue, setPostitListValue] = useState([]);

    // 리스트에 포스트잇 추가
    const addPostitValue = postit => {
        setPostitListValue(postitListValue.concat({ ...postit }));
    };

    // 수정 필요
    const trackPos = (element, data) => {
        nodeRef.current.focus();
        element.x = data.x
        element.y = data.y
    };

    // 모달 창 state
    const [modal, setModal] = useState(false);

    // 모달 창 open / close
    const openModal = () => setModal(true);
    const closeModal = () => setModal(false);

    return (
        <div key="createPostit">
            <Title>{boardData.title}</Title>
            {/* 게시판 영역에 포스트잇 생성 */}
            <BoardContainer>
                {postitListValue.map(element =>
                    <Draggable nodeRef={nodeRef} key={element.postitNo} onDrag={(_, data) => trackPos(element, data)}>
                        <PostitOnBoard ref={nodeRef} key={element.postitNo} color={element.color} onClick={() => alert('포스트잇 클릭!')}>
                            <div style={{ fontFamily: `${element.font}`, fontSize: '13px', fontWeight: 'bold' }}>
                                {element.title}
                            </div>
                            <div style={{ position: 'absolute', top: '55%', left: '50%', fontFamily: `${element.font}`, fontSize: '11px', transform: 'translate(-50%, -50%)'}}>
                                {element.content}
                            </div>
                        </PostitOnBoard>
                    </Draggable>
                )}
            </BoardContainer>
            <AddPostitButton src={add} alt="addPostit" onClick={openModal} />
            {/* 포스트잇 입력 모달 창 */}
            {modal === true ? 
                <Modal 
                    postitNo={postitListValue.length + 1}
                    addPostitValue={addPostitValue} 
                    closeModal={closeModal} 
                /> : null
            }
        </div>
    );
}

export default CreatePostit;

const BoardContainer = styled.div`
    position: relative;
    margin: 0 auto;
    width: 80%;
    height: 67vh;
    border: 1px solid #333;
    padding: 10px 0 30px 0;
    border-radius: 5px;
    margin-bottom: 50px;
    background-color: white;
    overflow: auto;
`;

const PostitOnBoard = styled.div`
    position: absolute;
    display: inline-block;
    width: 100px;
    height: 100px;
    padding-top: 6px;
    background-color: ${props => props.color || 'consilk'};
    box-shadow: 1px 1px 1px 1px gray;
    border-radius: 5px;

    &:hover {
        cursor: pointer;
        outline-color: transparent;
        outline-style: solid;
        box-shadow: 0 0 0 2px black;
    }
`;

const AddPostitButton = styled.img`
    position: fixed;
    display: inline-block;
    bottom: 15px;
    right: 25px;
    width: 40px;
    height: 40px;
    background-color: transparent;
    border: 2px solid black;
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