import styled from "styled-components";

export const FormLabel = styled.label`
    display: inline-block;
    width: ${props => props.width || 120}px;
    text-align: center;
    font-size: ${props => props.fontSize};
    color: ${props => props.color || 'black'};
`;