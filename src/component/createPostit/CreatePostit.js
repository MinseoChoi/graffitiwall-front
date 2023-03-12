import { useState, useEffect, useRef } from 'react';
import { useDrag } from 'react-use-gesture';
import { useParams } from 'react-router-dom';
import Draggable from 'react-draggable';
import './CreatePostit.css';
import add from '../../image/addPostit.svg';
import modalClose from '../../image/modalClose.svg';

const CreatePostit = () => {
    const [modal, setModal] = useState(false);
    const {boardId} = useParams();
    
    // test
    console.log(boardId);

    const [postitValue, setPostitValue] = useState({
        postitNo: 1,
        title: '',
        content: '',
        color: 'cornsilk'
    });

    const handlePostitValue = (count) => {
        setPostitValue({
            postitNo: count,
            title: '',
            content: '',
            color: 'cornsilk'
        })
    };

    const getPostitValue = e => {
        const { name, value } = e.target;
        setPostitValue({
            ...postitValue,
            [name]: value
        })
    };

    // useEffect 추가 필요할 수도..

    const [postitListValue, setPostitListValue] = useState([]);

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

    const [pos, setPos] = useState({  x: 0, y: 0  });

    const nodeRef = useRef();

    const trackPos = (data) => {
        nodeRef.current.focus();
        setPos({ 
            x: data.x,
            y: data.y
        });
    };

    // postitListValue
    // postitNo
    // title
    // content
    // color
    return (
        <div key="board">
            <div className='board-container'>
                {postitListValue.map(element =>
                    <Draggable nodeRef={nodeRef} key={element.postitNo} onDrag={(e, data) =>  {trackPos(data); console.log(data) }}>
                        <div ref={nodeRef} key={element.postitNo} className='board-postit' style={{ backgroundColor: element.color }}>
                            <h4>
                                {element.postitNo}번째 포스트잇<br />
                                {element.title}
                            </h4>
                            <div>
                                {element.content}
                            </div>
                            <div>x: {pos.x.toFixed(0)}, y: {pos.y.toFixed(0)}</div>
                        </div>
                    </Draggable>
                )}
            </div>
            <button className="addPostitButton" onClick={() => { setModal(!modal) }}>
                <img src={add} className="addPostitBtn" alt="addPostit" />
            </button>
            {
                modal === true ? (
                    <div className='overlay'>
                        <div className='form-wrapper' style={{ backgroundColor: postitValue.color }}>
                            <button className='close-button' onClick={() => {
                                handlePostitValue(postitValue.postitNo); // 포스트잇 초기화
                                setModal(false);
                            }}>
                                <img src={modalClose} className="close-btn" alt="close" />
                            </button>
                            <input className='title-input' type='text' placeholder='제목' onChange={getPostitValue} name='title' /><br />
                            <textarea className='content-input' rows='5' cols='33' placeholder='내용' onChange={getPostitValue} name='content'></textarea><br />
                            <input className='color-input' type='color' onChange={getPostitValue} name='color' />
                            <button className='submit-button' onClick={() => {
                                setPostitListValue(postitListValue.concat({ ...postitValue })); // '제목-내용' 포스트잇 리스트에 추가
                                // 포스트잇 초기화 - 포스트잇 넘버는 1 증가 -> 입력 없이 버튼 클릭 시 예외 처리
                                handlePostitValue(postitValue.postitNo + 1);
                                // 입력창 빈칸으로 변경
                                document.querySelector('.title-input').value = "";
                                document.querySelector('.content-input').value = "";
                                setModal(!modal);
                            }}>추가</button>
                        </div>
                    </div>
                ) : null
            }
        </div>
    );
}

export default CreatePostit;