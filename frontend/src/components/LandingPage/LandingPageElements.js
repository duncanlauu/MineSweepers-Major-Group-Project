import styled from "styled-components";

export const WelcomeText = styled.text`
    font-family: 'Source Sans Pro', sans-serif;
    color: #000;
    font-size: 20px;
    font-weight: 500;
`

export const LogoText = styled.text`
    font-family: 'Source Sans Pro', sans-serif;
    color: #000;
    font-size: 65px;
    font-weight: 600;
    line-height: 50px;
`

export const RoundedButton = styled.button`
    border: 3px solid black;
    border-radius: 100px;
    height: 3rem;
    width: 12rem;
    background-color: #fff;
    margin-top: 1rem;
    font-family: 'Source Sans Pro', sans-serif;
    font-weight: 600;
    &:hover {
        border: 0px;
        background-color: #653FFD;
        color: #FFF;
    }
`