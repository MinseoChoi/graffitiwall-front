import styled from "styled-components";

export const FormInput = styled.input`
    position: relative;
    margin: 0 auto;
    padding: ${props => props.padding || '4px 6px'};
    top: ${props => props.top || ''};
    width: ${props => props.width || '50vw'};
    height: ${props => props.height || 15}px;
    font-size: ${props => props.fontSize || '13px'};
    border: 1px solid black;
    border-radius: 5px;
`;