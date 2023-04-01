import styled from "styled-components";

export const FormDiv = styled.div`
    display: ${props => props.display || 'flex'};
    padding: ${props => props.padding || 'auto'};
    margin-bottom: ${props => props.marginBottom || 40}px;
    width: ${props => props.width + 'vw' || 'auto'};
    height: ${props => props.height || 'auto'};
    text-align: ${props => props.textAlign || 'left'};
`;