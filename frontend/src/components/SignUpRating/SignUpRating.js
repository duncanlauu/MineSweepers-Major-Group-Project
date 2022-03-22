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
    const[toggle , setToggle] = useState(true)




    useEffect(() => {
        getTopBooks();
    }, []);

    const getTopBooks = () => {
                axiosInstance
                    .post(`/recommender/0/12/top_n_global/`, {})
                    .then(() => {
                        axiosInstance
                        .get(`/recommender/0/12/top_n_global/`, {})
                        .then((res) => {
                            let books =[]
                            res.data.map((book) => {
                                books.push(book.book)
                            })
                            console.log(books)
                            setTopBooks(books)
                        }
                        ).catch((err) => {
                        console.log(err)
                })
                    }).catch((err) => {
                    console.log(err)
                })
        
    }
    

    const navigate = useNavigate();

    const createRatings = () => {
        for (let [id, rating] of Object.entries(ratings)){
            axiosInstance.post("/ratings/",{
                book: id,
                rating: rating * 2
            }).then((res) => {
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
            })         
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        createRatings()
        //await axiosInstance.post("/recommender/retrain", {})
        navigate("/home/")

    }

    const handleChange = ([id], rate) => {
        
        if(rate > 0){
            ratings[id] = rate
        } else {
            delete ratings[id]
        }   
        setRatings(ratings)
        setToggle(Object.keys(ratings).length === 0)
        console.log("submitting", ratings)

    };


   
    const createRows = () => {
        let rows =[]
        for (let i=0; i<3; ++i){
            let row = []
            for (let j=0; j<4; ++j){
                row.push(
                    <Col md="3">
                       <BookRatingCard id={topBooks[i*4+j].ISBN} title={topBooks[i*4+j].title} author={topBooks[i*4+j].author}
                        image ={topBooks[i*4+j].image_links_large} parentCallBack={handleChange}/>
                    </Col>
                )
                
            }
        rows.push(<Row style={{marginTop: "6rem"}}>{row}</Row>)
        }

        return rows
}

  
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
                {createRows()}
            <Row>
                <Col sm={{size: 10, offset: 5}}>
                    <Button
                    type="submit"
                    className="submit"
                    disabled={toggle}
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

if(topBooks.length > 0){
return( 
    <>
    {displayBooks(props)}
    </>
)
}else{
    return (
        <div id="ParentDiv">
                <Row>
                </Row>
                <Container fluid>
                    <Row style={{marginTop: "6rem"}}>
                        <Col/>
                        <Col>
                           <>Hi</>
                        </Col>
                        <Col/>
                    </Row>
                </Container>
            </div>
    )
}
}