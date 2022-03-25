import {Card, CardBody, CardImg, CardSubtitle, CardTitle} from 'reactstrap'
import ReactStars from 'react-stars'
import React, {useState} from "react";
import {Container, Row, Col, FormGroup, Label, Input, Button, Navbar, NavbarBrand} from 'reactstrap'
import { useEffect } from 'react';


export default function BookRatingCard(props){

    const title = props.title
    const author = props.author
    const image = props.image
    const id  = props.id
    const clearable = props.clearable
    const idReturn = props.idReturn
    const initialRating = props.initialRating

    

    const [rate, setRating] = useState(0);

    useEffect(() => {
        if (initialRating !== 0) {
            if (rate>0 && rate != initialRating/2){
                setRating(rate)
            }else{
                setRating(initialRating/2)
            }
        }
    })

    const ratingChanged = (newRating) => {
        console.log("Initial rating: " + props.initialRating)
        console.log("Rating changed: " + newRating + " previous rating: " + rate)
        if(idReturn){
        //console.log("id new rating in card: " + newRating + " for book " + id)
        props.parentCallBack([id], newRating)
        }else{
        //console.log("no id new rating in card: " + newRating + " for book " + id)
        props.parentCallBack(newRating)
        }
        setRating(newRating)
        
        

      }

    const clearRating = () => {
        console.log("Clearing rating")
        if(idReturn){
        props.parentCallBack([id], 0)
        }else{
        props.parentCallBack(0)
        }
        setRating(0)
        

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
            { title === undefined ? <></> : <CardTitle tag="h4">{title}</CardTitle>}
    
            { author === undefined ? <></> : <CardSubtitle className="mb-2 text-muted"
                tag="h7">{author}</CardSubtitle>}
                
                <Row>
                    <Col>
                        <ReactStars
                            count={5}
                            onChange={ratingChanged}
                            value = {rate}
                            size={24}
                            color2={'#ffd700'} />
                    </Col>
                    {clearable ? 
                        <Col>
                            <Button
                                type="submit"
                                className="submit"
                                onClick={clearRating}
                                style={{backgroundColor: "#653FFD", width: "7rem"}}
                                > Clear
                            </Button>
                        </Col> : <></>
                    }
                </Row>

            </CardBody>
        </Card>
        </>
    );

}