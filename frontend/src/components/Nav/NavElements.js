import styled from 'styled-components';

export const NavMenu = styled.div`
    display: flex;
    height: 3rem;
    width: 10rem;
    justify-content: center;
    align-items: center;
    margin-right: 14rem;
    > * {
        margin-right: 1rem;
    }
`

export const SearchContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`

export const SearchResult = styled.div`
    display: flex;
    margin-top: 1rem;
    margin-bottom: 1rem;
`

export const SearchText = styled.div`
    margin-left: 2rem;
    font-family: "Source Sans Pro", sans-serif;
    font-size: medium;
    font-weight: 500;
    line-height: 20px;
    color: #000;
`

export const SearchBarHeading = styled.text`
    font-family: 'Source Sans Pro';
    font-weight: 600;
    font-size: 18px;
    margin-left: 1rem;
    color: #000;
`

export const HeadingText = styled.text`
    font-family: 'Source Sans Pro', sans-serif;
    font-size: 17px;
    font-weight: 600;
    color: #000;
    line-height: 20px;
`

export const SubHeadingText = styled.text`
    font-family: 'Source Sans Pro', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #653FFD;
    line-height: 13px;
`

export const ParaText = styled.text`
    font-family: 'Source Sans Pro', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: #071C4E;
`