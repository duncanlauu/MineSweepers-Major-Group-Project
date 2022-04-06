import {Col, Container} from "reactstrap";
import {HeadingText, SubHeadingText} from "./NavElements";
import React from "react";

export const SearchBookCard = (props) => {
    const name = props.name;
    const author = props.author;
    const imageURL = props.image;

    return (
        <Container
            fluid
            style={{display: "flex", flexDirection: "row", marginBottom: "2rem"}}
        >
            <Col xs={3}>
                <img src={imageURL} alt="Book Cover"/>
            </Col>
            <Col xs={9} style={{padding: "0px"}}>
                <HeadingText>{name}</HeadingText>
                <br/>
                <SubHeadingText>{author}</SubHeadingText>
                <br/>
            </Col>
        </Container>
    );
};

export default SearchBookCard;