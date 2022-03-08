import styled from "styled-components";

export const NotificationsContainer = styled.div`
    height: 100%;
    width: 100%;
    background-color: #fff;
    border-radius: 10px;
`

export const NotifBar = styled.div`
    width: 100%;
    height: 7.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
`

export const NotifDate = styled.div`
    width: 100%;
    background-color: #653DDF;
    height: 2.5rem;
    font-family: "Source Sans Pro", sans-serif;
    color: #FFF;
    align-items: center;
    justify-content: center;
    border-radius: 10px 10px 0px 0px;
    > * {
        margin-left: 2rem;
    }
`

export const Heading3Text = styled.text`
    font-family: "Source Sans Pro", sans-serif;
    font-size: 15px;
    font-weight: 600;
`