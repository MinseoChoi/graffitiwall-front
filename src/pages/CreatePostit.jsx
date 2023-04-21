import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Draggable from 'react-draggable';
import { Resizable } from 're-resizable';
import FadeLoader from 'react-spinners/FadeLoader';
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

    const [loading, setLoading] = useState(true);

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
    }, []);

    useEffect(() => {
        const getPostits = async () => {
            await request(`/boards/${boardId}/postits`)
            .then(json => {
                setPostitListValue(json);
            })
            .then(res => setLoading(false))
        };
        getPostits();
    }, [postitListValue]);

    // 리스트에 포스트잇 추가
    const addPostitValue = postit => {
        setPostitListValue(postitListValue.concat({ ...postit }));
    };

    /* ------ Board Zoom and Pan ------ */
    let posX = 0;
    let posY = 0;
    const [screen, setScreen] = useState({ top: 0, left: 0 });
    const [ratio, setRatio] = useState(1);

    // Zoom 이벤트 - 0.4 ~ 2배
    const wheelHandler = e => {
        setRatio(
            ratio >= 0.4 ? ratio + (-0.001) * e.deltaY : 0.4
        );
    };

    // onDragStart 이벤트
    const moveScreenStart = e => {
        const img = new Image();
        e.dataTransfer.setDragImage(img, 0, 0);

        posX = e.pageX;
        posY = e.pageY;
    };

    // onDrag 이벤트
    const moveScreen = e => {
        const limitX = e.target.offsetLeft + (e.pageX - posX) <= 0;
        const limitY = e.target.offsetTop + (e.pageY - posY) <= 0;
        
        e.target.style.left = limitX
            ? `${e.target.offsestLeft + (e.pageX - posX)}px`
            : '0px';
        e.target.style.top = limitY
            ? `${e.target.offsetTop + (e.pageY - posY)}px`
            : '0px';

        posX = limitX ? e.pageX : 0;
        posY = limitY ? e.pageY : 0;
    };

    // onDragEnd 이벤트
    const moveScreenEnd = e => {
        const limitX = e.target.offsetLeft + (e.pageX - posX) <= 0;
        const limitY = e.target.offsetTop + (e.pageY - posY) <= 0;

        e.target.style.left = limitX
            ? `${e.target.offsestLeft + (e.pageX - posX)}px`
            : '0px';
        e.target.style.top = limitY
            ? `${e.target.offsetTop + (e.pageY - posY)}px`
            : '0px';
        
        posX = limitX ? e.pageX : 0;
        posY = limitY ? e.pageY : 0;

        setScreen({ top: e.target.style.top, left: e.target.style.left });
    }

    /* ------ Postit Drag and Drop & Click ------ */
    const boardRef = useRef(null); // 게시판 영역(div) 위치 가져오기 위함
    const postitRef = useRef([]); // 포스트잇 영역(div) 위치 가져오기 위함 (여러 개이므로 배열 형태)

    const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 }); // 드래그인지 클릭인지 확인하기 위함

    // 클릭한 포스트잇 정보
    const [selectedPostitValue, setSelectedPostitValue] = useState({
        show: false,
        title: '',
        contents: '',
        color: '',
        font: '',
        views: 0,
        updatedAt: ''
    });

    // onDragStart 이벤트
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

    // onDragEnd 이벤트
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
                views: element.views,
                updatedAt: element.updatedAt
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

    /* ------ Postit Resize ------ */
    const savePostit = async (element, d) => {
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
                sizeX: element.sizeX + d.width,
                sizeY: element.sizeY + d.height,
                views: element.views
            })
        });
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
                <BoardContainer 
                    ref={boardRef} 
                    // ratio={ratio} 
                    // onWheel={wheelHandler}
                    // onDragStart={e => moveScreenStart(e)}
                    // onDrag={e => moveScreen(e)}
                    // onDragEnd={e => moveScreenEnd(e)}
                    // draggable
                >
                    {loading ? <LoadingWrapper>
                            <FadeLoader radius={2} height={15} width={5} color="#B0D6B2" />
                        </LoadingWrapper>
                        : 
                            postitListValue.map(element =>
                                <Draggable
                                    key={element.postitId}
                                    onStart={e => onStart(e, element)}
                                    onStop={e => onStop(e, element)}
                                >
                                    <Resizable
                                        style={{ 
                                            position: 'absolute',
                                            display: 'block',
                                            width: element.sizeX + 'px',
                                            height: element.sizeY + 'px',
                                            paddingTop: '10px',
                                            top: element.positionY + 'px',
                                            left: element.positionX + 'px',
                                            backgroundColor: element.color,
                                            boxShadow: '3px 3px 3px rgb(0, 0, 0, 0.1)',
                                            borderRadius: '5px',
                                            cursor: 'pointer'
                                        }}
                                        key={element.postitId}
                                        defaultSize={{ width: element.sizeX, height: element.sizeY }}
                                        minWidth={80}
                                        minHeight={80}
                                        maxWidth={300}
                                        maxHeight={300}
                                        onResizeStart={(e, direction) => {
                                            e.stopPropagation();
                                        }}
                                        onResizeStop={(e, direction, ref, d) => {
                                            savePostit(element, d);
                                        }}
                                        enable={{ top: false, right: false, bottom: false, left: false, topLeft: false, topRight: false, bottomLeft: false, bottomRight: true }}
                                    >
                                        <div ref={el => postitRef.current[element.postitId] = el} key={element.postitId}>
                                            <PostitTitle fontFamily={element.font}>{element.title}</PostitTitle>
                                            <PostitContent fontFamily={element.font}>{element.contents}</PostitContent>
                                        </div>
                                    </Resizable>
                                </Draggable>
                            )
                    }
                    {/* 게시판 영역에 포스트잇 생성 */}
                    {/* {postitListValue.map(element =>
                        <Draggable
                            key={element.postitId}
                            onStart={e => onStart(e, element)}
                            onStop={e => onStop(e, element)}
                        >
                            <Resizable
                                style={{ 
                                    position: 'absolute',
                                    display: 'block',
                                    width: element.sizeX + 'px',
                                    height: element.sizeY + 'px',
                                    paddingTop: '10px',
                                    top: element.positionY + 'px',
                                    left: element.positionX + 'px',
                                    backgroundColor: element.color,
                                    boxShadow: '3px 3px 3px rgb(0, 0, 0, 0.1)',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
                                key={element.postitId}
                                defaultSize={{ width: element.sizeX, height: element.sizeY }}
                                minWidth={80}
                                minHeight={80}
                                maxWidth={300}
                                maxHeight={300}
                                onResizeStart={(e, direction) => {
                                    e.stopPropagation();
                                }}
                                onResizeStop={(e, direction, ref, d) => {
                                    savePostit(element, d);
                                }}
                                enable={{ top: false, right: false, bottom: false, left: false, topLeft: false, topRight: false, bottomLeft: false, bottomRight: true }}
                            >
                                <div ref={el => postitRef.current[element.postitId] = el} key={element.postitId}>
                                    <PostitTitle fontFamily={element.font}>{element.title}</PostitTitle>
                                    <PostitContent fontFamily={element.font}>{element.contents}</PostitContent>
                                </div>
                            </Resizable>
                        </Draggable>
                    )} */}
                </BoardContainer>
            </BoardSpace>
            <AddPostitButton src={add} alt="포스트잇 생성" onClick={openModal} />
            {/* 포스트잇 생성 모달 창 */}
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
    margin: 0 auto;
    // right: 25px;
    top: 195px;
    left: 100px;
    width: 80%;
    height: 67vh;
    border: 1px solid lightgray;
    padding: 10px 0 30px 0;
    border-raius;
    margin-bottom: 50px;
    background-color: white;
    box-shadow: 3px 3px 3px rgb(0, 0, 0, 0.1);
    overflow: hidden;
    // top: 195px;
    // left: 120px;
    // width: 80%;
    // height: 70vh;
`;

const BoardContainer = styled.div`
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // width: ${props => 160 / props.ratio}%;
    // height: ${props => 160 / props.ratio}%;
    // transform: scale(${props => props.ratio >= 2 ? 2: props.ratio});
    transform-origin: left top;
    // margin: 0 auto;
    // right: 25px;
    // width: 100%;
    // height: 67vh;
    // border: 1px solid lightgray;
    // padding: 10px 0 30px 0;
    // border-radius: 5px;
    // margin-bottom: 50px;
    // background-color: white;
    // box-shadow: 3px 3px 3px rgb(0, 0, 0, 0.1);
    // overflow: auto;
`;

const PostitOnBoard = styled.div`
    position: absolute;
    display: block;
    width: ${props => props.width || 100}px;
    height: ${props => props.height || 100}px;
    padding-top: 6px;
    top: 0px;
    left: 0px;
    // top: ${props => props.top}px;
    // left: ${props => props.left}px;
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

const LoadingWrapper = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

const PostitTitle = styled.div`
    position: relative;
    margin-bottom: 10px;
    font-family: ${props => props.fontFamily};
    font-size: 80%;
    font-weight: bold;
`;

const PostitContent = styled.div`
    position: relative;
    padding: 4px 6px;
    font-family: ${props => props.fontFamily};
    font-size: 75%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
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