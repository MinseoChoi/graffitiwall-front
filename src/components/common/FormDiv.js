import styled from "styled-components";

export const FormDiv = styled.div`
    display: ${props => props.display || 'flex'};
    padding: ${props => props.padding || 'auto'};
    margin-top: ${props => props.marginTop || 'auto'};
    margin-bottom: ${props => props.marginBottom || 40}px;
    margin-left: ${props => props.marginLeft || 0}px;
    width: ${props => props.width + 'vw' || 'auto'};
    height: ${props => props.height || 'auto'};
    justify-content: ${props => props.justifyContent || ''};
    text-align: ${props => props.textAlign || 'left'};
`;