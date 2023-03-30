import styled from "styled-components";

export const FormInput = styled.input`
    margin: 0 auto;
    padding: ${props => props.padding || '4px 6px'};
    width: ${props => props.width || '50vw'};
    height: ${props => props.height || 15}px;
    font-size: ${props => props.fontSize || 13}px;
    border: 1px solid black;
    border-radius: 5px;
`;