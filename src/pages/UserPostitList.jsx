import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import Draggable from 'react-draggable';
import { PostitEditModal } from "../components/Modal";
import bin from '../assets/bin.svg';
import { Title } from "../components/common";
import { request } from '../utils/api';

const UserPostitList = () => {
    // 삭제 => 휴지통으로 드래그 앤 드롭
    // 추후 가능하다면, 검색 기능

    // 포스트잇 리스트
    const [postitListValue, setPostitListValue] = useState([]);

    // GET 메소드로 포스트잇 정보 가져오기
    useEffect(() => {
        // API url 변경 필요!!! 일단, 확인을 위해 게시판 1에 있는 포스트잇 불러와 사용
        const getPostits = async () => {
            await request(`/boards/1/postits`)
            .then(json => setPostitListValue(json))
        };
        getPostits();
    }, [postitListValue]);

    const containerRef = useRef(null);
    const postitRef = useRef([]);

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
        setOriginPos({ x: distanceChildFromLeft(element.postitId), y: distanceChildFromTop(element.postitId) });
    };

    const distanceChildFromTop = (postitId) => {
        let peTop = containerRef.current.getBoundingClientRect().top;
        let chTop = postitRef.current[postitId].getBoundingClientRect().top;
        return chTop - peTop;
    };

    const distanceChildFromLeft = (postitId) => {
        let peLeft = containerRef.current.getBoundingClientRect().left;
        let chLeft = postitRef.current[postitId].getBoundingClientRect().left;
        return chLeft - peLeft;
    };

    // 드래그 끝
    const onStop = (e, element) => {
        // 좌표 변화 계산
        const dragX = Math.abs(dragStartPos.x - e.pageX);
        const dragY = Math.abs(dragStartPos.y - e.pageY);

        if (dragX === 0 && dragY === 0) {
            openModal();
            setSelectedPostitValue({
                show: true,
                ...element
            })
        } else {
            // 휴지통으로 드래그 앤 드롭 이벤트 넣어야 함
            // 드롭했을 때 휴지통 영역에 없으면 원래 자리로 이동
            // ???
            postitRef.current[element.postitId].top = originPos.y;
            postitRef.current[element.postitId].left = originPos.x;
            const onDelete = async () => {
                await request(`/postit/${element.postitId}`, {
                    method: 'DELETE'
                })
            }
            // onDelete();
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
            <Title>Postit List</Title>
            <PostitSpace>
                <PostitContainer ref={containerRef}>
                    {postitListValue.map(element =>
                        <Draggable
                            key={element.postitId}
                            onStart={(e) => onStart(e, element)}
                            onStop={(e) => onStop(e, element)}
                        >
                            <PostitOnContainer 
                                ref={el => (postitRef.current[element.postitId] = el)}
                                key={element.postitId} 
                                color={element.color}
                            >
                                <PostitTitle fontFamily={element.font}>{element.title}</PostitTitle>
                                <PostitContent fontFamily={element.font}>{element.contents}</PostitContent>
                            </PostitOnContainer>
                        </Draggable>
                    )}
                </PostitContainer>
            </PostitSpace>
            <DeletePostitButton src={bin} alt="DeletePostit" onClick={() => alert('delete!')} />
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
    padding-top: 6px;
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