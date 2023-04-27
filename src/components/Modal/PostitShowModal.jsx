import { useState } from "react";
import { useEffect } from "react";
import styled from "styled-components";
import { request } from "../../utils/api";

// 선택한 포스트잇 보여주는 모달 창
const PostitShowModal = ({ element, closeModal }) => {
    const updatedAt = new Date(element.updatedAt); // 수정 날짜
    const [status, setStatus] = useState('');

    useEffect(() => {
        const getUser = async () => {
            await request(`/users/${element.userId}`)
            .then(json => setStatus(json.status))
        };

        getUser();
    }, []);

    return (
        /* 모달 창 */
        <ModalOverlay>
            <ModalWrapper color={element.color}>
                <CloseModalButton src={process.env.PUBLIC_URL + '/assets/modalClose.svg'} alt="close" onClick={closeModal} />
                <TextDiv height={40} fontFamily={element.font} fontSize={12} textAlign='right' lineHeight={1.5}>
                    <div>
                        작성자 {status === 'ACTIVE' ? element.writer : '(알 수 없음)'}
                    </div>
                    <div>
                        조회수 {element.views >= 999 ? '999+' : element.views} / 수정 날짜 {updatedAt.getFullYear()}.{updatedAt.getMonth() + 1}.{updatedAt.getDate()}
                    </div>
                </TextDiv>
                <TextDiv height={30} fontFamily={element.font} fontSize={18}>
                    {element.title}
                </TextDiv>
                <TextDiv height={260} fontFamily={element.font} fontSize={15} textAlign='left' overflow='auto'>
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
    left: 29%;
    width: calc(4rem + 38vw);
    height: 400px;
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
    left: ${props => props.left || '4.2%'};
    width: ${props => props.width || 'calc(2.5rem + 36vw)'};
    height: ${props => props.height}px;
    margin-top: 12px;
    padding: 6px 6px 0px 6px;
    font-family: ${props => props.fontFamily};
    font-size: ${props => props.fontSize}px;
    text-align: ${props => props.textAlign || 'center'};
    line-height: ${props => props.lineHeight};
    white-space: normal;
    word-break: break-all;
    background-color: white;
    border-radius: 5px;
    outline: none;
    opacity: 0.7;
    overflow: ${props => props.overflow || 'hidden'};
`;