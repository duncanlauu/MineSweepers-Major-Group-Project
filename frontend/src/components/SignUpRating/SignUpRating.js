import { Card, CardBody, CardImg } from 'reactstrap'
import Rater from 'react-rater'
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import axiosInstance from '../../axios';
import BookRatingCard from './BookRatingCard';
import { Container, Row, Col, FormGroup, Label, Input, Button, Navbar, NavbarBrand } from 'reactstrap'
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import { Oval } from 'react-loader-spinner';
import useHasRated from '../hooks/useHasRated';

export default function SignUpRating(props) {

    const [ratings, setRatings] = useState({})
    const [topBooks, setTopBooks] = useState([])
    const [toggle, setToggle] = useState(true)

    const { setHasRated } = useHasRated()
    const location = useLocation();
    const from = location.state?.from?.pathname || "/home"

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
                        let books = []
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

        trackPromise(
            axiosInstance
                .post(`/recommender/0/12/top_n_global/`, {})
                .then(() => {
                    axiosInstance
                        .get(`/recommender/0/12/top_n_global/`, {})
                        .then((res) => {
                            let books = []
                            res.data.map((book) => {
                                books.push(book.book)
                            })
                            console.log(books)
                        }
                        ).catch((err) => {
                            console.log(err)
                        })
                }).catch((err) => {
                    console.log(err)
                })
        );

    }


    const navigate = useNavigate();

    const createRatings = () => {
        for (let [id, rating] of Object.entries(ratings)) {
            axiosInstance.post("/ratings/", {
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        createRatings()
        //await axiosInstance.post("/recommender/retrain", {})
        console.log(from)
        setHasRated({ hasRated: "true" })
        localStorage.setItem("hasRated", true)
        // set local storage here as well

        setRatings({})
        setTopBooks([])
        setToggle(true)
        navigate(from)
    }

    const handleChange = ([id], rate) => {

        if (rate > 0) {
            ratings[id] = rate
        } else {
            delete ratings[id]
        }
        setRatings(ratings)
        setToggle(Object.keys(ratings).length === 0)
        console.log("submitting", ratings)
    };



    const createRows = () => {
        let rows = []
        for (let i = 0; i < 3; ++i) {
            let row = []
            for (let j = 0; j < 4; ++j) {
                row.push(
                    <Col md="3">
                        <BookRatingCard id={topBooks[i * 4 + j].ISBN} title={topBooks[i * 4 + j].title} author={topBooks[i * 4 + j].author}
                            image={topBooks[i * 4 + j].image_links_large} parentCallBack={handleChange} clearable={true} idReturn={true} />
                    </Col>
                )

            }
            rows.push(<Row style={{ marginTop: "6rem" }}>{row}</Row>)
        }

        return rows
    }


    const LoadingIndicator = (props) => {

        const { promiseInProgress } = usePromiseTracker();

        return (
            promiseInProgress &&
            <Container>
                <div style={{
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Oval color="#653FFD" secondaryColor='#B29FFE' height="100" width="100" />
                </div>
            </Container>
        )
    }



    const displayBooks = (e) => {

        return (

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
                    <Row style={{display:"flex", justifyContent:"center", marginTop:"3rem", marginBottom:"2rem"}}>
                        {/* <Col sm={{ size: 10, offset: 5 }} style={{, alignSelf:"center"}}> */}
                            <Button
                                type="submit"
                                className="submit"
                                disabled={toggle}
                                onClick={handleSubmit}
                                style={{ backgroundColor: "#653FFD", width: "20rem", height:"5rem", borderRadius:"100px"  }}
                            >
                                Finish
                            </Button>
                        {/* </Col> */}
                    </Row>

                </Container>


            </>


        );
    }

    if (topBooks.length > 0) {
        return (
            <>
                {displayBooks(props)}
            </>
        )
    } else {
        return (
            <div id="ParentDiv">
                <Row>
                </Row>
                <Container fluid>
                    <Row style={{ marginTop: "6rem" }}>
                        <Col />
                        <Col>
                            <LoadingIndicator />
                        </Col>
                        <Col />
                    </Row>
                </Container>
            </div>
        )
    }
}