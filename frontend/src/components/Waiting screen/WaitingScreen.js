import React, {useEffect} from "react";
import {useNavigate} from "react-router";
import axiosInstance from "../../axios";
import {
    Container,
    Row,
    Col,
    Navbar,
    NavbarBrand,
} from "reactstrap";
import {usePromiseTracker, trackPromise} from "react-promise-tracker";
import {Oval} from "react-loader-spinner";
import {HeadingText, ParaText} from "../Login/LoginElements";

export default function WaitingScreen() {
    let navigate = useNavigate();
    let retrained = false;

    const LoadingIndicator = () => {
        const {promiseInProgress} = usePromiseTracker();

        return (
            promiseInProgress && (
                <Container>
                    <div
                        style={{
                            display: "flex",
                            width: "100%",
                            height: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Oval
                            color="#653FFD"
                            secondaryColor="#B29FFE"
                            height="100"
                            width="100"
                        />
                    </div>
                </Container>
            )
        );
    };

    useEffect(() => {
        if (!retrained) {
            retrained = true;
            trackPromise(
                axiosInstance
                    .post("recommender/retrain/")
                    .then(() => {
                        navigate("/");
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            );
        }
    }, []);

    return (
        <div style={{overflowX: "hidden"}}>
            <Row>
                <Navbar color="light" expand="md" light>
                    <NavbarBrand href="/">
                        <h1> bookgle </h1>
                    </NavbarBrand>
                </Navbar>
            </Row>
            <Row style={{marginTop: "6rem"}}>
                <Col/>
                <Col>
                    <HeadingText>We're getting the account ready for you</HeadingText>
                    <br/>
                    <br/>
                    <ParaText>Don't worry, it's only necessary when you sign up for the first time!</ParaText>
                    <br/>
                    <br/>
                    <LoadingIndicator/>
                </Col>
                <Col/>
            </Row>
        </div>
    )
}
