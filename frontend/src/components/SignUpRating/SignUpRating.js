import {Card, CardBody, CardImg} from 'reactstrap'
import Rater from 'react-rater'
import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router";
import axiosInstance from '../../axios';

import BookRatingCard from './BookRatingCard';
import {Container, Row, Col, FormGroup, Label, Input, Button, Navbar, NavbarBrand} from 'reactstrap'
import useGetUser from "../../helpers";


export default function SignUpRating(props){

    const [ratings, setRatings] = useState({})
    const [topBooks, setTopBooks] = useState([])
    const user =  useGetUser();



    useEffect(() => {
        getTopBooks();
    }, []);

    const getTopBooks = () => {
                axiosInstance
                    .get(`/recommender/0/12/top_n_global/`, {})
                    .then((res) => {
                        let book_list = []
                        for (let i = 0; i < res.data.length; ++i) {
                            book_list.push({id: res.data[i]['book'], name: res.data[i]['book']})
                        }
                        setTopBooks(book_list)
                        console.log("Book list: " + book_list)
                        console.log(topBooks) 
                    }).catch((err) => {
                    console.log(err)
                })
        
    }
    

    const navigate = useNavigate();

    const createRatings = () => {
        for(let i =0; i<topBooks.length; ++i){
            axiosInstance.post("",{
                user_id: user.id,
                book_id: topBooks[i].id,
                rating: ratings[topBooks[i].id]
            }).catch((err) => {
                console.log(err)
            })         
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        createRatings().then( response =>{
            axiosInstance.post("/recommender/retrain").then(() => {
                navigate("/log_in/")
            }).catch((err) => {
                console.log(err)
            })
        })

        
        
    }

    

   

    const handleChange = ({id, rate}) => {
        //console.log("Child data:  id:" + id + " rating: " + rate)
        if(rate > 0){
        setRatings(prevState => ({
            ...prevState,
            [id]: rate
        }));
        //console.log("new ratings: " + JSON.stringify(ratings))
        } else {
            const copyRatings = {...ratings}
            delete copyRatings[id] 
            setRatings(copyRatings)
            console.log("Ratings after deletion: " + JSON.stringify(ratings))
        }
        //console.log("Books: " + JSON.stringify(topBooks, null))
    };


   


  
const displayBooks = (e) => {

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