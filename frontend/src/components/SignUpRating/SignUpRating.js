import {Card, CardBody, CardImg} from 'reactstrap'
import Rater from 'react-rater'
import React, {useState} from "react";
import {useNavigate} from "react-router";
import axiosInstance from '../../axios';
import BookRatingCard from './BookRatingCard';
import {Container, Row, Col, FormGroup, Label, Input, Button, Navbar, NavbarBrand} from 'reactstrap'


export default function SignUpRating(){
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("submitting", ratings)
        navigate("/log_in/")
        
    }

    const [ratings, setRatings] = useState({})

   

    const handleChange = (childData) => {
        const { id, rating } = childData;
        if(rating > 0){
        setState(prevState => ({
            ...prevState,
            [id]: rating
        }));
        } else {
            const copyRatings = {...this.state.ratings}
            delete copyRatings[id] 
            setState({ratings: copyRatings})
        }
    };


   


  


    return(
        <>
        <Row>
            <Navbar color="light" expand="md" light>
                <NavbarBrand href="/">
                        <h1> bookgle </h1>
                </NavbarBrand>
            </Navbar>
        </Row>
        <Container fluid>
            <Row style={{marginTop: "6rem"}}>
                <Col>
                    <BookRatingCard image ='https://picsum.photos/318/270' title='Simon book' author='Simon' id={2} parentCallBack ={handleChange}/> 
                </Col>
                <Col>
                    <BookRatingCard image ='https://picsum.photos/318/270' title='Simon book' author='Simon' id={3} parentCallBack ={handleChange}/> 
                </Col>
                <Col>
                    <BookRatingCard image ='https://picsum.photos/318/270' title='Simon book' author='Simon' id={4} parentCallBack ={handleChange}/> 
                </Col>
                <Col>
                    <BookRatingCard image ='https://picsum.photos/318/270' title='Simon book' author='Simon' id={5} parentCallBack ={handleChange}/> 
                </Col>
            </Row>  
            <Row>
                <Col sm={{size: 10, offset: 5}}>
                    <Button
                    type="submit"
                    className="submit"
                    disabled={Object.keys(ratings).length === 0}
                    onClick={handleSubmit}
                    style={{backgroundColor: "#653FFD", width: "7rem"}}
                    >
                            Finish
                    </Button>
                </Col>
            </Row>
            
        </Container>


        </>
            
    );

}