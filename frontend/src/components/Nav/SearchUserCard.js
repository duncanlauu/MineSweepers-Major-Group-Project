import {Col, Container} from "reactstrap";
import Gravatar from "react-gravatar";
import {HeadingText, ParaText, SubHeadingText} from "./NavElements";
import React from "react";

export const SearchUserCard = (props) => {
    const username = props.username;
    const email = props.email;
    const bio = props.bio.slice(0, 35) + "...";

    return (
        <Container
            fluid
            style={{display: "flex", flexDirection: "row", marginBottom: "2rem"}}
        >
            <Col xs={3}>
                <Gravatar email={email} style={{borderRadius: "100px"}}/>
            </Col>
            <Col xs={9} style={{padding: "0px"}}>
                <HeadingText>{username}</HeadingText>
                <br/>
                <SubHeadingText>{email}</SubHeadingText>
                <br/>
                <ParaText>{bio}</ParaText>
            </Col>
        </Container>
    );
};

export default SearchUserCard;