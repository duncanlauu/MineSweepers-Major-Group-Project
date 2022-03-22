import {Card, CardBody, CardImg, CardSubtitle, CardTitle} from 'reactstrap'
import ReactStars from 'react-stars'
import React, {useState} from "react";
import {Container, Row, Col, FormGroup, Label, Input, Button, Navbar, NavbarBrand} from 'reactstrap'


export default function BookRatingCard(props){

    const title = props.title
    const author = props.author
    const image = props.image
    const id  = props.id

    const [rate, setRating] = useState(0)
    //const [id, setId] = useState(props.id)



    const ratingChanged = async (newRating) => {
        console.log("Rating changed: " + newRating + " previous rating: " + rate)
        props.parentCallBack([id], newRating)
        setRating(newRating)
        
        

      }

    const clearRating = () => {
        setRating(0)
        props.parentCallBack([id], 0)
        

    }




    return(
        <>
        <Card
        style={{padding:"1rem"}}>
            <CardImg
                src={image}
                top
                width="100%"
                />

            <CardBody>
                <CardTitle
                tag="h4">
                  {title}
                </CardTitle>

                <CardSubtitle
                className="mb-2 text-muted"
                tag="h7"
                >
                    {author}
                </CardSubtitle>
                <Row>
                    <Col>
                        <ReactStars
                            count={5}
                            onChange={ratingChanged}
                            value = {rate}
                            size={24}
                            color2={'#ffd700'} />
                    </Col>
                    <Col>
                        <Button

                            type="submit"
                            className="submit"
                            onClick={clearRating}
                            style={{backgroundColor: "#653FFD", width: "7rem"}}
                        >
                            Clear
                        </Button>
                    </Col>
                </Row>

            </CardBody>
        </Card>
        </>
    );

}