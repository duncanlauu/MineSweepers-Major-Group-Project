import React from 'react'
import { Row, Col } from 'reactstrap'
import { BookHeading, BookProfile, RatingPill, RatingsText, YearAuthorInfo } from './RecommenderPageElements'

function IndividualBookCard(props) {
    return (
        <Row>
            <BookProfile>
                <Col xs={2}>
                    <img src={props.imageURL} alt="Book Cover" />
                </Col>
                <Col xs={10}>
                    <a href={`/book_profile/${props.isbn}`}>
                        <BookHeading>{props.title}</BookHeading><br />
                    </a>
                    <YearAuthorInfo>{props.author}, {props.year}</YearAuthorInfo><br />
                    {props.rating && props.numberOfRatings &&
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <RatingPill style={{ borderRadius: "10px", marginRight: "1rem" }}>
                                <span>
                                    {props.rating.toString().slice(0, 3)}
                                </span>
                                <img src='../../../static/images/RatingStar.svg' />
                            </RatingPill>
                            <RatingsText>{props.numberOfRatings.toString()} ratings</RatingsText>
                        </div>
                    }
                </Col>
            </BookProfile>
        </Row>
    )
}

export default IndividualBookCard