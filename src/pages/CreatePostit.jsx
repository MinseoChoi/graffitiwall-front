import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Draggable from 'react-draggable';
import { PostitCreateModal, PostitShowModal } from '../components/Modal';
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
    //     PosTemp["left"] = e.target.offsetLeft + e.clientX - clientPos.x;
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

    // 포스트잇 리스트
    const [postitListValue, setPostitListValue] = useState([]);

    // url에서 게시판 ID 가져오기
    const {boardId} = useParams();

    // GET 메소드로 게시판 정보(게시판 ID, 게시판 제목) / 포스트잇 정보 가져오기
    useEffect(() => {
        const getBoardName = async () => {
            await request(`/boards/${boardId}`)
            .then(json => setBoardData({ boardId: json.boardId, title: json.title}))
        };
        getBoardName();

        const getPostits = async () => {
            await request(`/boards/${boardId}/postits`)
            .then(json => setPostitListValue(json))
        };
        getPostits();
    }, []);

    // 리스트에 포스트잇 추가
    const addPostitValue = postit => {
        setPostitListValue(postitListValue.concat({ ...postit }));
    };

    /* ------ 드래그 앤 드롭 / 클릭 이벤트 ------ */
    const boardRef = useRef(null); // 게시판 영역(div) 위치 가져오기 위함
    const postitRef = useRef([]); // 포스트잇 영역(div) 위치 가져오기 위함 (여러 개이므로 배열 형태)

    const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 }); // 드래그인지 클릭인지 확인하기 위함

    // 포스트잇 크기 변경
    // const [{ x, y, w, h }, setConfig] = useState({
    //     x: 0,
    //     y: 0,
    //     w: 0,
    //     h: 0
    // });

    // const boundaryRef = useRef(null);

    // useEffect(() => {
    //     const boundary = boundaryRef.current.getBoundingClientRect();

    //     if (boundary) {
    //         const DEFAULT_W = 100;
    //         const DEFAULT_H = 100;
    //         setConfig({
    //             x: Math.floor(boundary.width / 2 - DEFAULT_W / 2),
    //             y: Math.floor(boundary.height / 2 - DEFAULT_H / 2),
    //             w: DEFAULT_W,
    //             h: DEFAULT_H
    //         });
    //     }
    // }, []);

    // 클릭한 포스트잇 정보
    const [selectedPostitValue, setSelectedPostitValue] = useState({
        show: false,
        title: '',
        contents: '',
        color: '',
        font: '',
        views: 0
    });

    // 드래그 시작
    const onStart = e => {
        setDragStartPos({ x: e.pageX, y: e.pageY });
    };

    // 부모 요소(top)와의 거리 계산
    const distanceChildFromTop = (postitId) => {
        let peTop = boardRef.current.getBoundingClientRect().top;
        let chTop = postitRef.current[postitId].getBoundingClientRect().top;
        return chTop - peTop;
    };

    // 부모 요쇼(left)와의 거리 계산
    const distanceChildFromLeft = (postitId) => {
        let peLeft = boardRef.current.getBoundingClientRect().left;
        let chLeft = postitRef.current[postitId].getBoundingClientRect().left;
        return chLeft - peLeft;
    }

    // 드래그 끝
    const onStop = (e, element) => {
        // 좌표 변화 계산
        const dragX = Math.abs(dragStartPos.x - e.pageX);
        const dragY = Math.abs(dragStartPos.y - e.pageY);
        
        if (dragX === 0 && dragY === 0) {
            // 클릭 이벤트인 경우, 클릭한 포스트잇 정보 저장 / 조회수 추가
            setSelectedPostitValue({
                show: true,
                title: element.title,
                contents: element.contents,
                color: element.color,
                font: element.font,
                views: element.views
            });

            // 조회수 변경 -> 백엔드에서 구현 후 추가
            const changeViews = async () => {
                await request(`/postit/${element.postitId}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        boardId: element.boardId,
                        userId: element.userId,
                        postitId: element.postitId,
                        title: element.title,
                        contents: element.contents,
                        font: element.font,
                        color: element.color,
                        positionX: element.positionX,
                        positionY: element.positionY,
                        angle: element.angle,
                        sizeX: element.sizeX,
                        sizeY: element.sizeY,
                        views: element.views + 1
                    })
                })
            };
            // changeViews();
        } else {
            // 드래그 앤 드롭 이벤트인 경우, 좌표 저장
            const x = distanceChildFromLeft(element.postitId);
            const y = distanceChildFromTop(element.postitId);
            
            postitRef.current[element.postitId].top = y;
            postitRef.current[element.postitId].left = x;

            const savePostit = async () => {
                await request(`/postit/${element.postitId}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        boardId: element.boardId,
                        userId: element.userId,
                        postitId: element.postitId,
                        title: element.title,
                        contents: element.contents,
                        font: element.font,
                        color: element.color,
                        positionX: x,
                        positionY: y,
                        angle: element.angle,
                        sizeX: element.sizeX,
                        sizeY: element.sizeY,
                        views: element.views
                    })
                });
            }
            savePostit();
        }
    };

    /* ------ 모달 창 ------ */
    // 모달 창 state(open/close)
    const [modal, setModal] = useState(false);

    // 모달 창 state 변경 함수
    const openModal = () => setModal(true);
    const closeModal = () => {
        setModal(false);
        setSelectedPostitValue({
            ...selectedPostitValue,
            show: false
        });
    };

    return (
        <div>
            <Title>{boardData.title}</Title>
            <BoardSpace>
                {/* 게시판 영역에 포스트잇 생성 */}
                <BoardContainer ref={boardRef}>
                    {postitListValue.map(element =>
                        <Draggable 
                            key={element.postitId} 
                            onStart={(e) => onStart(e, element)}
                            onStop={(e) => onStop(e, element)}
                        >
                            <PostitOnBoard 
                                ref={el => (postitRef.current[element.postitId] = el)} 
                                key={element.postitId} 
                                top={element.positionY}
                                left={element.positionX}
                                color={element.color}
                            >
                                <PostitTitle fontFamily={element.font}>{element.title}</PostitTitle>
                                <PostitContent fontFamily={element.font}>{element.contents}</PostitContent>
                            </PostitOnBoard>
                        </Draggable>
                    )}
                </BoardContainer>
            </BoardSpace>
            <AddPostitButton src={add} alt="addPostit" onClick={openModal} />
            {/* 포스트잇 입력 모달 창 */}
            {modal === true ? 
                <PostitCreateModal 
                    boardId={boardId}
                    postitId={postitListValue.length + 1}
                    addPostitValue={addPostitValue} 
                    closeModal={closeModal} 
                /> : null
            }
            {/* 선택한 포스트잇 보여주는 모달 창 */}
            {selectedPostitValue.show === true ?
                <PostitShowModal element={selectedPostitValue} closeModal={closeModal} /> 
                : null
            }
        </div>
    );
}

export default CreatePostit;

const BoardSpace = styled.div`
    position: absolute;
    top: 195px;
    left: 120px;
    width: 80%;
    height: 70vh;
`;

const BoardContainer = styled.div`
    position: relative;
    margin: 0 auto;
    right: 25px;
    width: 100%;
    height: 67vh;
    border: 1px solid lightgray;
    padding: 10px 0 30px 0;
    border-radius: 5px;
    margin-bottom: 50px;
    background-color: white;
    box-shadow: 3px 3px 3px rgb(0, 0, 0, 0.1);
    overflow: auto;
`;

const PostitOnBoard = styled.div`
    position: absolute;
    display: inline-block;
    width: 100px;
    height: 100px;
    padding-top: 6px;
    top: ${props => props.top}px;
    left: ${props => props.left}px;
    background-color: ${props => props.color || 'consilk'};
    box-shadow: 3px 3px 3px rgb(0, 0, 0, 0.1);
    border-radius: 5px;

    &:hover {
        cursor: pointer;
        outline-color: transparent;
        outline-style: solid;
        box-shadow: 0 0 0 1px lightgray;
    }
`;

const PostitTitle = styled.div`
    font-family: ${props => props.fontFamily};
    font-size: 13px;
    font-weight: bold;
`;

const PostitContent = styled.div`
    position: absolute;
    top: 55%;
    left: 50%;
    font-family: ${props => props.fontFamily};
    font-size: 11px;
    transform: translate(-50%, -50%);
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