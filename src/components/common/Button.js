import styled from "styled-components";

export const Button = styled.button`
    position: absolute;
    bottom: -40px;
    right: 50px;
    width: 120px;
    height: 30px;
    border-color: transparent;
    border-radius: 5px;
    color: #00AAE0;
    background-color: #DEF7FF;

    &:hover {
        cursor: pointer;
    }

    &:disabled {
        background-color: #D9D9D9;
        color: black;
    }
`;