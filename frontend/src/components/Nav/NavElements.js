import styled from 'styled-components';

export const NavMenu = styled.div`
    display: flex;
    height: 3rem;
    width: 10rem;
    justify-content: center;
    align-items: center;
    margin-right: 10rem;
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