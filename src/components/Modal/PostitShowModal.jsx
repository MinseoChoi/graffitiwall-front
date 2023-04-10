import styled from "styled-components";
import modalClose from '../../assets/modalClose.svg';

const PostitShowModal = ({ element, closeModal }) => {
    return (
        /* 모달 창 */
        <ModalOverlay>
            <ModalWrapper color={element.color}>
                <CloseModalButton src={modalClose} alt="close" onClick={closeModal} />
                <TextDiv height={30} fontFamily={element.font} fontSize={18}>
                    {element.title}
                </TextDiv>
                <TextDiv height={285} fontFamily={element.font} fontSize={15}>
                    {element.contents}
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
    width: 33vw;
    height: 350px;
    background-color: ${props => props.color || 'cornsilk'};
    border-radius: 15px;
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
    left: 4.5%;
    width: 30vw;
    height: ${props => props.height}px;
    margin-top: 10px;
    font-family: ${props => props.fontFamily};
    font-size: ${props => props.fontSize}px;
    background-color: white;
    border-radius: 5px;
    outline: none;
    opacity: 0.6;
`;