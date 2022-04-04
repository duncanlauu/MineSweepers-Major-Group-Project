import styled from "styled-components";

export const WelcomeText = styled.text`
    font-family: 'Source Sans Pro', sans-serif;
    color: #000;
    opacity: 0.6;
    font-size: 20px;
    font-weight: 500;
    text-align: center;
`

export const LogoText = styled.text`
    font-family: 'Source Sans Pro', sans-serif;
    color: #000;
    font-size: 50px;
    font-weight: 500;
    line-height: 60px;
    margin-bottom: 5rem;
`

export const LoginText = styled.text`
    font-family: "Source Sans Pro";
    font-size: 15px;
    color: #0057FF;
`

export const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 4rem;
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

export const UnderLineText = styled.text`
    position: absolute;
    left: 12%;
    top: 16rem;
    width: 250px;
    height: 14px;
    transform: skew(-12deg) translateX(-50%);
    background: rgba(101,63,253,0.5);
    z-index: -1;
`

export const PurpleCircle = styled.div`
    height: 15rem;
    width: 15rem;
    position: absolute;
    border-radius: 100%;
    background-color: #653FFD;
    bottom: 38rem;
    left: 10rem;
    z-index: -2;
`

export const BlueCircle = styled.div`
    height: 11rem;
    width: 11rem;
    position: absolute;
    border-radius: 100%;
    background-color: #7BA8FF;
    bottom: 41rem;
    left: 3rem;
    z-index: -1;
`