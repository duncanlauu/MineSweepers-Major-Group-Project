import {Container, Col} from "reactstrap";
import {HeadingText, ParaText, SubHeadingText} from "./NavElements";
import Gravatar from 'react-gravatar';
import React from "react";

const SearchClubCard = (props) => {
    const name = props.name;
    const ownerEmail = props.ownerEmail;
    const description = props.description.slice(0, 35) + '...';

    return (
        <Container fluid style={{display: 'flex', flexDirection: 'row', marginBottom: '2rem'}}>
            <Col xs={3}>
                <Gravatar email={ownerEmail} style={{borderRadius: '100px'}}/>
            </Col>
            <Col xs={9} style={{padding: '0px'}}>
                <HeadingText>{name}</HeadingText><br/>
                <SubHeadingText>{ownerEmail}</SubHeadingText><br/>
                <ParaText>
                    {description}
                </ParaText>
            </Col>
        </Container>
    );
}

export default SearchClubCard;