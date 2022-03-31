import styled from "styled-components";

export const EmptyChatText = styled.text`
    font-family: 'Source Sans Pro';
    color: #585858;
    font-size: 20px;
    margin-top: 3rem;
    text-align: center;
`

export const ImageDiv = styled.div`
    height: 5rem;
    width: 5rem;
`

export const MessageProfile = styled.div`
    background-color: #fff;
    font-family: 'Source Sans Pro';
    width: 100%;
    height: 7rem;
    color: #000;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`

export const MessageSendBox = styled.div`
    display: flex;
    width: 100%;
    flex-direction: row;
    background-color: #F2F2F2;
`

export const MessageText = styled.text`
    font-weight: 500;
    /* color: #000; */
    font-size: 17px;
    font-family: 'Source Sans Pro';
`

export const MessagingProfileHeading = styled.text`
    font-family: 'Source Sans Pro';
    /* color: #000; */
    font-weight: 600;
    font-size: 15px;
`

export const MessagingProfilePara = styled.text`
    font-family: 'Source Sans Pro';
    color: #fff;
    opacity: 50%;
    font-size: 12px;
    font-weight: 500;
`

export const ReceivedMessagePara = styled.text`
    font-family: 'Source Sans Pro';
    color: #000;
    opacity: 50%;
    font-size: 12px;
`

export const SidePanelTextPreview = styled.text`
    font-family: 'Source Sans Pro';
    color: #585858;
    font-size: 12px;
`

export const MessagingDisplay = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
`

export const TitleBar = styled.div`
    background-color: #653FFD;
    color: #fff;
    font-family: 'Source Sans Pro';
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 3rem;
    border-radius: 10px 10px 0px 0px;
    position: absolute;
    top: 0px;
    padding-top: 0;
    font-weight: 500;
    font-size: 15px;
    > * {
        margin-left: 2rem;
    }
`

export const EmptyChatContainer = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
`

export const ChatContainer = styled.div`
    height: 36vw;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    border-radius: 10px;
    overflow-y: scroll;
`

export const SidePanelContainer = styled.div`
    height: 36vw;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    background-color: #fff;
    border-radius: 10px;
    margin-bottom: 3rem;
`