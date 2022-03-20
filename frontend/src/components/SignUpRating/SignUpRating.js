import {Card, CardBody, CardImg} from 'reactstrap'
import Rater from 'react-rater'
import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router";
import axiosInstance from '../../axios';
import BookRatingCard from './BookRatingCard';
import {Container, Row, Col, FormGroup, Label, Input, Button, Navbar, NavbarBrand} from 'reactstrap'


export default function SignUpRating(props){

    const [ratings, setRatings] = useState({})
    const [topBooks, setTopBooks] = useState("")

    useEffect (() => {
        getTopBooks()
    }, []);
    



    const getTopBooks = () => {
        axiosInstance
        .get("/recommender/1/13/top_n_global/")
        .then((res) => {
            setTopBooks(res.data.incoming)
            console.log(res.data.incoming)
        })
        .catch((err) => {
            console.log(err)
        })
    }
    

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault()
        

        axiosInstance.post("/recommender/retrain")
        navigate("/log_in/")
    }

    

   

    const handleChange = ({id, rate}) => {
        console.log("Child data:  id:" + id + " rating: " + rate)
        if(rate > 0){
        setRatings(prevState => ({
            ...prevState,
            [id]: rate
        }));
        console.log("new ratings: " + JSON.stringify(ratings))
        } else {
            const copyRatings = {...ratings}
            delete copyRatings[id] 
            setRatings(copyRatings)
        }
        console.log("Ratings: " + JSON.stringify(ratings))
    };


   


  
const displayBooks = (e) => {
    console.log(topBooks)

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
                <BookRatingCard image ='https://picsum.photos/318/270' title='Simon book' author='Simon' id={2} parentCallBack={handleChange}/> 
                </Col> 
                <Col>
                <BookRatingCard image ='https://picsum.photos/318/270' title='Simon book' author='Simon' id={3} parentCallBack={handleChange}/> 
                </Col> 
                <Col>
                <BookRatingCard image ='https://picsum.photos/318/270' title='Simon book' author='Simon' id={4} parentCallBack={handleChange}/> 
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


return( 
    <>
    {displayBooks(props)}
    </>
)

}