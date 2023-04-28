import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import FadeLoader from 'react-spinners/FadeLoader';
import { PostitEditModal } from "../components/Modal";
import { Title } from "../components/common";
import { request } from '../utils/api';
import { SearchBox } from "../components/SearchBox";

/* 유저가 생성한 포스트잇 목록 페이지 */
const UserPostitList = () => {
    // 로딩 state
    const [loading, setLoading] = useState(true);

    // 포스트잇 리스트
    const [postitListValue, setPostitListValue] = useState([]);

    // url에서 userId 가져오기
    const { userId } = useParams();

    const [keyword, setKeyword] = useState('');

    const onChangeKeyword = e => {
        setKeyword(e.target.value);
    };

    // GET 메소드로 포스트잇 정보 가져오기
    useEffect(() => {
        const getPostits = async () => {
            await request(`/users/${userId}/postit`)
            .then(json => setPostitListValue(json))
            .then(res => setLoading(false))
        };
        getPostits();
    }, []);

    /* ------ Postit Drag and Drop ------ */
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

    // onDragStart 이벤트
    const onStart = (e, element) => {
        setDragStartPos({ x: e.pageX, y: e.pageY });
        setOriginPos({ x: e.target.offsetLeft, y: e.target.offsetTop });
    };

    // onDrag 이벤트
    const onDrag = (e, element) => {
        setDragStartPos({ x: e.pageX, y: e.pageY });
    };

    // onDragEnd 이벤트
    const onStop = (e, element) => {
        let deleteTop = deleteRef.current.getBoundingClientRect().top;            
        let deleteLeft = deleteRef.current.getBoundingClientRect().left;
        
        // 휴지통 영역에 드롭된 경우, 해당 포스트잇 삭제
        if (dragStartPos.y  - deleteTop >= 0 && dragStartPos.x - deleteLeft >= 0) {
            const onDelete = async () => {
                await request(`/postit/${element.postitId}`, {
                    method: 'DELETE'
                })

                await request(`/users/${userId}/postit`)
                .then(json => setPostitListValue(json))
            };
            onDelete();
        }
        // 휴지통 영역에 드롭되지 않았을 경우, 원래 자리로 이동
        else {
            setDragStartPos(originPos);
        }
    };

    /* ------ 모달 창 ------ */
    // 모달 창 state(open/close)
    const [modal, setModal] = useState(false);

    // 모달 창 state 변경 함수
    const openModal = () => setModal(true);
    const closeModal = async () => {
        setModal(false);

        setSelectedPostitValue({
            ...selectedPostitValue,
            show: false
        });

        await request(`/users/${userId}/postit`)
        .then(json => setPostitListValue(json));
    };

    // 포스트잇 클릭 시, 선택한 포스트잇 정보 저장
    const onClick = (e, element) => {
        openModal();
        setSelectedPostitValue({
            show: true,
            ...element
        })
    };

    return (
        <div>
            <Title>Postit List</Title>
            <SearchBox name='포스트잇' keyword={keyword} onChangeKeyword={onChangeKeyword} />
            <PostitSpace>
                <PostitContainer ref={containerRef}>
                    {loading ? <LoadingWrapper>
                            <FadeLoader radius={2} height={15} width={5} color="#B0D6B2" />
                        </LoadingWrapper>
                        : postitListValue
                            .filter(element =>
                                element.title.toLowerCase().includes(keyword.toLowerCase())
                                || element.contents.toLowerCase().includes(keyword.toLowerCase())
                            )
                            .map(element =>
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
                                    <PostitContent fontFamily={element.font}>
                                        {element.contents.split('\n').map((line, index) => {
                                            return (
                                                <span key={index}>
                                                    {line}
                                                    <br />
                                                </span>
                                            );
                                        })}
                                    </PostitContent>
                                </PostitOnContainer>
                            )
                    }
                </PostitContainer>
                <DeletePostitButton ref={deleteRef} src={process.env.PUBLIC_URL + '/assets/bin.svg'} alt="DeletePostit" />
            </PostitSpace>
            {/* 선택한 포스트잇 보여주는 모달 창 */}
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
    display: grid;
    grid-template-rows: repeat(auto-fill, 120px);
    grid-template-columns: repeat(auto-fill, 120px);
    position: relative;
    margin: 0 auto;
    right: 25px;
    width: 74vw;
    height: 550px;
    border: 1px solid lightgray;
    border-radius: 5px;
    margin-bottom: 50px;
    background-color: white;
    box-shadow: 3px 3px 3px rgb(0, 0, 0, 0.1);
    overflow: auto;
`;

const LoadingWrapper = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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
    position: relative;
    margin-bottom: 6px;
    font-family: ${props => props.fontFamily};
    font-size: 13px;
    font-weight: bold;
`;

const PostitContent = styled.div`
    position: relative;
    height: 60%;
    padding: 4px 2px;
    font-family: ${props => props.fontFamily};
    font-size: 11px;
    padding-left: 4px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
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