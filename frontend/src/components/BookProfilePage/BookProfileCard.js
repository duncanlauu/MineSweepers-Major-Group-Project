import {Button, Card, CardBody, CardImg} from "reactstrap";
import ReactStars from "react-stars";
import React, {useState} from "react";
import {Row, Col} from "reactstrap";
import {useEffect} from "react";

export default function BookProfileCard(props) {
    const image = props.image;
    const clearable = props.clearable;
    const initialRating = props.initialRating;

    const [rate, setRating] = useState(0);

    useEffect(() => {
        if (initialRating !== 0) {
            if (rate > 0 && rate !== initialRating / 2) {
                setRating(rate);
            } else {
                setRating(initialRating / 2);
            }
        }
    });

    const ratingChanged = (newRating) => {
        console.log("Initial rating: " + props.initialRating);
        console.log("Rating changed: " + newRating + " previous rating: " + rate);
        props.parentCallBack(newRating);
        setRating(newRating);
    };

    const clearRating = () => {
        console.log("Clearing rating");
        props.parentCallBack(0);
        setRating(0);
    };

    return (
        <>
            <Card
                style={{
                    height: "520px",
                    width: "400px",
                    border: " 3px solid rgba(0,0,0,.125)",
                }}
            >
                <CardImg data-testid={"book-profile-card-image"} src={image} top style={{height: "450px"}}/>

                <CardBody>
                    <Row style={{bottom: "1rem", top: "2rem"}}>
                        <Col>
                            <ReactStars
                                count={5}
                                onChange={ratingChanged}
                                value={rate}
                                size={30}
                                color2={"#ffd700"}
                            />
                        </Col>
                        {clearable ? (
                            <Col style={{display: "flex", justifyContent: "flex-end"}}>
                                <Button
                                    type="submit"
                                    className="submit"
                                    onClick={clearRating}
                                    style={{
                                        backgroundColor: "#653FFD",
                                        width: "7rem",
                                        borderRadius: "10px",
                                        fontSize: "15px",
                                        border: " 3px solid rgba(0,0,0,.125)"
                                    }}
                                >
                                    {" "}
                                    Clear
                                </Button>
                            </Col>
                        ) : (
                            <></>
                        )}
                    </Row>
                </CardBody>
            </Card>
        </>
    );
}
