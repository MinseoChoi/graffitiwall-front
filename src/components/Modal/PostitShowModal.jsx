import styled from "styled-components";
import modalClose from '../../assets/modalClose.svg';

// 선택한 포스트잇 보여주는 모달 창
const PostitShowModal = ({ element, closeModal }) => {
    const updatedAt = new Date(element.updatedAt); // 수정 날짜

    return (
        /* 모달 창 */
        <ModalOverlay>
            <ModalWrapper color={element.color}>
                <CloseModalButton src={modalClose} alt="close" onClick={closeModal} />
                <TextDiv display='flex' height={23} fontFamily={element.font} fontSize={12}>
                    <TextDiv width='29%' left='-4px' marginTop={-3} textAlign='left'>
                        작성자 {element.writer}
                    </TextDiv>
                    <TextDiv width='71%' left='2px' marginTop={-3} textAlign='right'>
                        조회수 {element.views} / 수정 날짜 {updatedAt.getFullYear()}.{updatedAt.getMonth() + 1}.{updatedAt.getDate()}
                    </TextDiv>
                </TextDiv>
                <TextDiv height={30} fontFamily={element.font} fontSize={18}>
                    {element.title}
                </TextDiv>
                <TextDiv height={250} fontFamily={element.font} fontSize={15} textAlign='left' overflow='auto'>
                    {element.contents.split('\n').map((line, index) => {
                        return (
                            <span key={index}>
                                {line}
                                <br />
                            </span>
                        );
                    })}
                </TextDiv>
            </ModalWrapper>
        </ModalOverlay>
    );
};

export default PostitShowModal;

const ModalOverlay = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.2);
    z-index: 9999;
`;

const ModalWrapper = styled.form`
    position: absolute;
    top: 25%;
    left: 33%;
    width: calc(4rem + 34vw);
    height: 370px;
    background-color: ${props => props.color};
    border-radius: 15px;
    box-shadow: 10px 10px 5px rgb(0, 0, 0, 0.1);
`;

const CloseModalButton = styled.img`
    position: absolute;
    background-color: transparent;
    right: -45px;
    width: 30px;
    height: 30px;
    padding: 6px;
    border-radius: 8px;
    border-color: transparent;

    &:hover {
        cursor: pointer;
        outline-color: transparent;
        outline-style: solid;
        background: transparent;
        box-shadow: 0 0 0 1px black;
    }
`;

const TextDiv = styled.div`
    position: relative;
    display: ${props => props.display || 'block'};
    justify-contents: ${props => props.display === 'flex' ? 'space-between' : ''};
    left: ${props => props.left || '4.2%'};
    width: ${props => props.width || 'calc(2.5rem + 32vw)'};
    height: ${props => props.height}px;
    margin-top: ${props => props.marginTop || 10}px;
    padding: ${props => props.padding || '6px 6px 0px 6px'};
    font-family: ${props => props.fontFamily};
    font-size: ${props => props.fontSize}px;
    text-align: ${props => props.textAlign || 'center'};
    white-space: normal;
    word-break: break-all;
    background-color: white;
    border-radius: 5px;
    outline: none;
    opacity: 0.7;
    overflow: ${props => props.overflow || 'hidden'};
`;