import React, {useEffect, useState} from "react";
import {Container, Row, Col, Button} from "reactstrap";
import {useParams} from "react-router";
import axiosInstance from "../../axios";
import BookProfileCard from "./BookProfileCard";
import MainNav from "../Nav/MainNav";
import { Card, CardSubtitle, CardTitle } from "reactstrap";
import { useNavigate } from "react-router";

const BookProfilePage = () => {
    const {book_id} = useParams();
    const [book, setBook] = useState(null);
    const [toggle, setToggle] = useState(true);
    const [clearable, setClearable] = useState(true);
    const [previousRating, setPreviousRating] = useState(0);
    const [rating, setRatings] = useState(previousRating);

    const navigate = useNavigate();

    useEffect(() => {
        axiosInstance
            .get(`books/${book_id}`)
            .then((res) => {
                console.log(res);
                setBook(res.data);
                console.log("Book Data: ");
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });

        axiosInstance
            .get("ratings/")
            .then((res) => {
                console.log("User Ratings: ");
                console.log(res.data);

                let rated_books = [];

                for (let i = 0; i < res.data.ratings.length; i++) {
                    rated_books.push(res.data.ratings[i]);
                    console.log(i);
                }
                console.log(rated_books);

                rated_books.forEach((rated_book) => {
                    console.log("loop book:");
                    console.log(rated_book);
                    console.log(book_id);
                    if (rated_book.book === book_id) {
                        console.log("was in rating check");
                        setClearable(false);
                        setRatings(rated_book.rating);
                        setPreviousRating(rated_book);
                        setToggle(false);
                    }
                });

                console.log("out of mapping");
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const handleChange = (rate) => {
        console.log("new rating in profile " + rate);
        setRatings(rate);

        if (rate === 0) {
            setToggle(true);
        } else {
            setToggle(false);
        }
    };

    const handleSubmit = async (e) => {
        if (clearable) {
            console.log("new rating" + rating + " for book " + book_id);
            axiosInstance
                .post("/ratings/", {
                    book: book_id,
                    rating: rating * 2,
                })
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            console.log("update rating");
            axiosInstance
                .put(`/ratings/${previousRating.id}/`, {
                    rating: rating * 2,
                })
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        console.log("previous rating: " + previousRating.rating);
        setPreviousRating(rating);
        setClearable(false);
    };

    const navigateToRecommendations = () => {
        navigate("/recommendations");
    };

    if (!book) return null;

    return (
        <div>
            <Row style={{marginBottom: "3rem"}}>
                <MainNav/>
            </Row>
            <Container fluid>
                <Row
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: "2rem",
                    }}
                >
                    <Col xs="3">
                        <BookProfileCard
                            id={book_id}
                            image={book.image_links_large}
                            parentCallBack={handleChange}
                            clearable={clearable}
                            idReturn={false}
                            initialRating={previousRating.rating}
                        />

                        <Button
                            type="submit"
                            className="submit"
                            disabled={toggle}
                            onClick={handleSubmit}
                            style={{
                                backgroundColor: "#653FFD",
                                width: "400px",
                                height: "4rem",
                                borderBottomLeftRadius: "25px",
                                borderBottomRightRadius: "25px",
                                fontSize: "20px",
                            }}
                        >
                            {clearable ? "Submit rating" : "Update rating"}
                        </Button>
                    </Col>
                    <Col xs="1"/>
                    <Col xs="5" style={{}}>
                        <Card style={{padding: "1rem", borderRadius: "25px"}}>
                            <CardTitle
                                data-testid="title"
                                tag="h1"
                                style={{
                                    padding: "2rem",
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                {book.title}
                            </CardTitle>
                            <CardSubtitle tag="h2" style={{padding: "2rem"}} data-testid="author">
                                Author: {book.author}
                            </CardSubtitle>
                            <CardSubtitle tag="h2" style={{padding: "2rem"}} data-testid="publicationDate">
                                Date: {book.publication_date}
                            </CardSubtitle>
                            <CardSubtitle tag="h2" style={{padding: "2rem"}} data-testid="genre">
                                Genre: {book.genre}
                            </CardSubtitle>
                            <CardSubtitle tag="h2" style={{padding: "2rem"}} data-testid="publisher">
                                Publisher: {book.publisher}
                            </CardSubtitle>
                        </Card>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                paddingTop: "3rem",
                            }}
                        >
                            <Button
                                type="submit"
                                className="submit"
                                onClick={navigateToRecommendations}
                                style={{
                                    backgroundColor: "#653FFD",
                                    height: "4rem",
                                    borderRadius: "25px",
                                    fontSize: "20px",
                                    border: " 3px solid rgba(0,0,0,.125)",
                                }}
                            >
                                See your recommendations
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default BookProfilePage;
