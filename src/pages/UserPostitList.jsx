import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import Draggable from 'react-draggable';
import { PostitEditModal } from "../components/Modal";
import bin from '../assets/bin.svg';
import { Title } from "../components/common";
import { request } from '../utils/api';

const UserPostitList = () => {
    // 추후 가능하다면, 검색 기능

    // 포스트잇 리스트
    const [postitListValue, setPostitListValue] = useState([]);

    // GET 메소드로 포스트잇 정보 가져오기
    useEffect(() => {
        // API url 변경 필요!!! 일단, 확인을 위해 게시판 1에 있는 포스트잇 불러와 사용
        const getPostits = async () => {
            await request(`/boards/4/postits`)
            .then(json => setPostitListValue(json))
        };
        getPostits();
    }, [postitListValue]);

    const containerRef = useRef(null);
    const postitRef = useRef([]);
    const deleteRef = useRef(null);

    const [originPos, setOriginPos] = useState({ x: 0, y: 0 }); // 기존 포스트잇 위치
    const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 }); // 드래그인지 클릭인지 확인하기 위함

    // 클릭한 포스트잇 정보
    const [selectedPostitValue, setSelectedPostitValue] = useState({
        show: false,
        boardId: 1,
        userId: 1,
        postitId: 1,
        title: '',
        contents: '',
        color: '',
        font: '',
        positionX: 0,
        positionY: 0,
        angle: 0,
        sizeX : 100,
        sizeY: 100,
        views: 0
    });

    // 드래그 시작
    const onStart = (e, element) => {
        setDragStartPos({ x: e.pageX, y: e.pageY });
        setOriginPos({ x: e.target.offsetLeft, y: e.target.offsetTop });
    };

    const onDrag = (e, element) => {
        setDragStartPos({ x: e.pageX, y: e.pageY });
    }

    // 드래그 끝
    const onStop = (e, element) => {
        let deleteTop = deleteRef.current.getBoundingClientRect().top;            
        let deleteLeft = deleteRef.current.getBoundingClientRect().left;

        if (dragStartPos.y - deleteTop >= 0 && dragStartPos.x - deleteLeft >= 0) {
            // 휴지통 영역에 드롭된 경우, 해당 포스트잇 삭제
            const onDelete = async () => {
                await request(`/postit/${element.postitId}`, {
                    method: 'DELETE'
                })
            };
            onDelete();
        } else {
            // 휴지통 영역에 드롭되지 않았을 경우, 원래 자리로 이동
            setDragStartPos(originPos);
        }
    };

    const onClick = (e, element) => {
        openModal();
        setSelectedPostitValue({
            show: true,
            ...element
        })
    }

    const onDrop = e => {
        e.preventDefault();
        console.log('delete');
    };

    const onDragEnter = e => {
        e.preventDefault();
    }

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
            <Title>Postit List</Title>
            <PostitSpace>
                <PostitContainer ref={containerRef}>
                    {postitListValue.map(element =>
                        // <Draggable
                        //     key={element.postitId}
                        //     onStart={(e) => onStart(e, element)}
                        //     onStop={(e) => onStop(e, element)}
                        // >
                        //     <PostitOnContainer 
                        //         ref={el => (postitRef.current[element.postitId] = el)}
                        //         key={element.postitId} 
                        //         top={dragStartPos.y}
                        //         left={dragStartPos.x}
                        //         color={element.color}
                        //     >
                        //         <PostitTitle fontFamily={element.font}>{element.title}</PostitTitle>
                        //         <PostitContent fontFamily={element.font}>{element.contents}</PostitContent>
                        //     </PostitOnContainer>
                        // </Draggable>
                        <PostitOnContainer
                            ref={el => postitRef.current[element.postitId] = el}
                            key={element.postitId}
                            color={element.color}
                            draggable={true}
                            onDragStart={e => onStart(e, element)}
                            onDrag={e => onDrag(e, element)}
                            onDragEnd={e => onStop(e, element)}
                            onClick={e => onClick(e, element)}
                        >
                            <PostitTitle fontFamily={element.font}>{element.title}</PostitTitle>
                            <PostitContent fontFamily={element.font}>{element.contents}</PostitContent>
                        </PostitOnContainer>
                    )}
                </PostitContainer>
                <DeletePostitButton ref={deleteRef} src={bin} alt="DeletePostit" onDrop={onDrop} onDragEnter={onDragEnter} />
            </PostitSpace>
            {selectedPostitValue.show === true ?
                <PostitEditModal element={selectedPostitValue} closeModal={closeModal} />
                : null
            }
        </div>
    );
};

export default UserPostitList;

const PostitSpace = styled.div`
    position: absolute;
    top: 195px;
    left: 120px;
    width: 80%;
    height: 70vh;
`;

const PostitContainer = styled.div`
    display: flex;
    position: relative;
    margin: 0 auto;
    right: 25px;
    width: 80vw;
    height: 550px;
    border: 1px solid lightgray;
    border-radius: 5px;
    margin-bottom: 50px;
    background-color: white;
    box-shadow: 3px 3px 3px rgb(0, 0, 0, 0.1);
    overflow: auto;
`;

const PostitOnContainer = styled.div`
    position: relative;
    width: 100px;
    height: 100px;
    margin-top: 10px;
    margin-left: 10px;
    margin-right: 10px;
    padding-top: 6px;
    top: ${props => props.top}px;
    left: ${props => props.left}px;
    background-color: ${props => props.color};
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