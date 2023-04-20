import styled from "styled-components";

export const Title = styled.h2`
    position: ${props => props.position || 'fixed'};
    left: ${props => props.left || 72}px;
    width: ${props => props.width || '60%'};
    padding: 4px 6px;
    text-align: left;
    border-bottom: 1px solid black;
    z-index: 99;
`;