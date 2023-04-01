import styled from "styled-components";

export const FormContainer = styled.form`
    position: relative;
    display: flex;
    top: ${props => props.top || 30}px;
    left: ${props => props.left || -50}px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 18px;
`;