import styled from 'styled-components';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Draggable from 'react-draggable';
import { Resizable } from 're-resizable';
import FadeLoader from 'react-spinners/FadeLoader';
import { PostitCreateModal, PostitShowModal } from '../components/Modal';
import { Title } from '../components/common/Title.js';
import { request } from '../utils/api';

const CreatePostit = () => {
    // 로딩 state
    const [loading, setLoading] = useState(false);

    // 게시판 정보 ( 게시판 ID, 제목 )
    const [boardData, setBoardData] = useState({
        boardId: 1,
        title: ''
    });

    // 포스트잇 리스트
    const [postitListValue, setPostitListValue] = useState([]);
    
    // 포스트잇 생성 모달 창을 통해 생성한 포스트잇을 포스트잇 리스트에 추가
    const addPostitValue = postit => {
        setPostitListValue(postitListValue.concat({ ...postit }));
    };

    // url에서 게시판 ID 가져오기
    const {boardId} = useParams();

    let sessionStorage = window.sessionStorage;
    const [userId, setUserId] = useState(0);

    // 처음 렌더링 시, GET 메소드로 게시판 정보(게시판 ID, 게시판 제목) / 포스트잇 정보 가져오기
    useEffect(() => {
        const sessionSearch = sessionStorage.getItem('userRawId');
        
        if (sessionSearch) {
            setUserId(sessionSearch);
        }

        const getBoardName = async () => {
            setLoading(true);
            await request(`/boards/${boardId}`)
            .then(json => setBoardData({ boardId: json.boardId, title: json.title}))
        };
        getBoardName();

        const getPostits = async () => {
            await request(`/boards/${boardId}/postits`)
            .then(json => {
                setPostitListValue(json);
            })
            .then(res => setTimeout(() => {
                setLoading(false)}
                , 1500)
            );
        };
        getPostits();
    }, []);

    // /* ------ Board Zoom and Pan ------ */
    let posX = 0;
    let posY = 0;
    const [screen, setScreen] = useState({ top: 0, left: 0 });
    const [ratio, setRatio] = useState(1);

    // Zoom 이벤트 - 0.4 ~ 2배
    const wheelHandler = e => {
        setRatio(ratio =>
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
    };

    /* ------ Postit Drag and Drop & Click ------ */
    const boardRef = useRef(null); // 게시판 영역(div) 위치(top, left) 가져오기 위함
    const postitRef = useRef([]); // 포스트잇 영역(div) 위치(top, left) 가져오기 위함 (여러 개이므로 배열 형태)

    const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 }); // 드래그 이벤트인지 클릭 이벤트인지 확인하기 위함
    const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });

    // 클릭한 포스트잇 정보 => 클릭한 포스트잇 모달 창을 띄우기 위해 필요
    const [selectedPostitValue, setSelectedPostitValue] = useState({
        show: false,
        title: '',
        contents: '',
        color: '',
        font: '',
        views: 0,
        updatedAt: '',
        writer: '',
        userId: 1
    });

    // onDragStart 이벤트 : 초기 위치 저장
    const onStart = e => {
        setDragStartPos({ x: e.pageX, y: e.pageY });
        setCurrentPos({ x: e.pageX, y: e.pageY });
    };

    const onDrag = (e, element) => {
        setCurrentPos({ x: distanceChildFromLeft(element.postitId), y: distanceChildFromTop(element.postitId) - 10 });
    };

    // 부모 요소(board의 top)와 자식 요소(postit의 top)의 거리 계산
    const distanceChildFromTop = (postitId) => {
        let peTop = boardRef.current.getBoundingClientRect().top;
        let chTop = postitRef.current[postitId].getBoundingClientRect().top;
        return chTop - peTop;
    };

    // 부모 요쇼(board의 left)와 자식 요소(postit의 left)의 거리 계산
    const distanceChildFromLeft = (postitId) => {
        let peLeft = boardRef.current.getBoundingClientRect().left;
        let chLeft = postitRef.current[postitId].getBoundingClientRect().left;
        return chLeft - peLeft;
    };

    // onDragEnd 이벤트 : 좌표 변화를 계산하여 클릭 / 드래그 앤 드롭 이벤트 분리
    const onStop = (e, element) => {
        // 좌표 변화 계산
        const dragX = Math.abs(dragStartPos.x - e.pageX);
        const dragY = Math.abs(dragStartPos.y - e.pageY);

        // Click 이벤트
        if (dragX === 0 && dragY === 0) {
            // 조회수 변경
            const changeViews = async () => {
                setPostitListValue(postitListValue.map(postit =>
                    postit.postitId === element.postitId ? { ...postit, view: element.view + 1, writer: element.writer } : postit    
                ));

                // 클릭한 포스트잇 정보 저장
                setSelectedPostitValue({
                    show: true,
                    title: element.title,
                    contents: element.contents,
                    color: element.color,
                    font: element.font,
                    views: element.views + 1,
                    updatedAt: element.updatedAt,
                    writer: element.writer,
                    userId: element.userId
                });
    
                await request(`/postit/${element.postitId}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        ...element,
                        views: element.views + 1
                    })
                });
    
                await request(`/boards/${boardId}/postits`)
                .then(json => {
                    setPostitListValue(json);
                });
            };
            changeViews();
        }
        // Drag and Drop 이벤트
        else {
            /* ------ 수정해야 하는 부분 ------ */
            /**
             * < 문제 >
             *  포스트잇 드롭 시, api에는 제대로 된 위치가 저장되며 새로고침했을 때에도 잘 불러와지지만,
             *  화면 상에서 포스트잇이 드롭한 곳이 아닌 다른 곳에 위치한 것으로 보여짐
             */

            /**
             * < 원하는 방향 >
             *  - 드롭한 곳에 포스트잇이 정확히 위치해 있길 원함
             *  - 바뀐 포스트잇의 위치를 setState로 반영할 때, 바로바로 반영되길 원함
             * 
             * < 순서 >
             *  드롭 ---> 바뀐 위치 반영(setState) ---> PATCH
             */
            setPostitListValue(postitListValue.map(postit =>
                postit.postitId === element.postitId ? { ...postit, positionX: currentPos.x, positionY: currentPos.y } : postit
            ));

            const savePostit = async () => {
                // 이벤트가 발생한 포스트잇의 위치만 set, 나머지는 원래 값 그대로
                await request(`/postit/${element.postitId}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        ...element,
                        positionX: currentPos.x,
                        positionY: currentPos.y
                    })
                });

                await request(`/boards/${boardId}/postits`)
                .then(json => {
                    setPostitListValue(json);
                });
            };
            savePostit();
        }
    };

    const savePostit = async (element, d) => {
        const changePostitValue = async () => {
            // 이벤트가 발생한 포스트잇의 크기만 set, 나머지는 원래 값 그대로
            setPostitListValue(postitListValue.map(postit =>
                postit.postitId === element.postitId ? { ...postit, sizeX: element.sizeX + d.width, sizeY: element.sizeY + d.height } : postit    
            ));

            await request(`/postit/${element.postitId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    ...element,
                    sizeX: element.sizeX + d.width,
                    sizeY: element.sizeY + d.height
                })
            });

            await request(`/boards/${boardId}/postits`)
            .then(json => {
                setPostitListValue(json);
            });
        };
        changePostitValue();
    };

    /* ------ 모달 창 ------ */
    // 모달 창 state(open/close)
    const [modal, setModal] = useState(false);

    // 모달 창 state 변경 함수
    const openModal = () => {
        if (userId !== 0) setModal(true);
        else alert('로그인이 필요한 서비스입니다.');
    };
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
                <BoardContainer ref={boardRef}>
                    {/* 
                        로딩 중 -> 스피너
                        로딩 끝 -> 게시판 영역에 포스트잇 display
                     */}
                    {loading ? 
                        <LoadingWrapper>
                            <FadeLoader radius={2} height={15} width={5} color="#B0D6B2" />
                        </LoadingWrapper>
                    : 
                        postitListValue.map(element =>
                            <Draggable
                                key={element.postitId}
                                onStart={e => onStart(e, element)}
                                onDrag={e => onDrag(e, element)}
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
                                        cursor: 'pointer',
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
                                    <div ref={el => postitRef.current[element.postitId] = el} key={element.postitId} style={{ width: element.sizeX + 'px', height: element.sizeY + 'px' }}>
                                        <PostitTitle fontFamily={element.font}>{element.title}</PostitTitle>
                                        <PostitContent height={element.sizeY} fontFamily={element.font}>
                                            {element.contents.split('\n').map((line, index) => {
                                                return (
                                                    <span key={index}>
                                                        {line}
                                                        <br />
                                                    </span>
                                                );
                                            })}
                                        </PostitContent>
                                    </div>
                                </Resizable>
                            </Draggable>
                        )
                    }
                </BoardContainer>
            </BoardSpace>
            <AddPostitButton src={process.env.PUBLIC_URL + '/assets/add.svg'} alt="포스트잇 생성" onClick={openModal} />
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

export default React.memo(CreatePostit);

const BoardSpace = styled.div`
    position: absolute;
    margin: 0 auto;
    // right: 25px;
    top: 195px;
    left: 100px;
    width: 80%;
    height: 70vh;
    border: 1px solid lightgray;
    // padding: 10px 0 30px 0;
    border-radius: 5px;
    // margin-bottom: 50px;
    background-color: white;
    box-shadow: 3px 3px 3px rgb(0, 0, 0, 0.1);
    border-radius: 5px;
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
    border-radius: 5px;
    // width: ${props => 160 / props.ratio}%;
    // height: ${props => 160 / props.ratio}%;
    // transform: scale(${props => props.ratio >= 2 ? 2: props.ratio});
    // transform-origin: left top;
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
    overflow: auto;
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
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    -ms-user-select: none;
    -moz-user-select: -moz-none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    user-select: none;
`;

const PostitContent = styled.div`
    position: relative;
    height: ${props => props.height - 50}px;
    padding: 4px 6px;
    font-family: ${props => props.fontFamily};
    font-size: 75%;
    // word-wrap: break-word;
    // white-space: rowwrap;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    -ms-user-select: none;
    -moz-user-select: -moz-none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    user-select: none;
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