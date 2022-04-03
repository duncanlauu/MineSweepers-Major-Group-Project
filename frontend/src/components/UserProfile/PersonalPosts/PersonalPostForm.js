import React, {useState, useEffect} from "react";
import {
    Container,
    Form,
    FormGroup,
    Label,
    Input,
    Row,
    Col,
    Button,
} from "reactstrap";
import axiosInstance from "../../../axios";
import {useNavigate} from "react-router";

export default function PersonalPostForm(props) {
    const [titleErr, setTitleErr] = useState("");
    const [contentErr, setContentErr] = useState("");
    const [clubIDErr, setClubIDErr] = useState("");
    const [clubData, setClubData] = useState(null);
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const [availableClubs, setAvailableClubs] = useState("");

    const initialFormData = Object.freeze({
        // After the user has typed in their data, it can no longer be changed. (.freeze)
        club_id: "",
        title: "",
        content: "",
        image_link: "",
        book_link: "",
    });

    const [formData, updateFormData] = useState(initialFormData);
    const navigate = useNavigate();

    useEffect(() => {
        if (typeof currentUser.id != "undefined") {
            getAvailableClubs();
            if (props.personalPost !== undefined) {
                updateFormData(props.personalPost)
            }
        }
    }, []);

    const handleChange = (e) => {
        updateFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePostFriendRequest = (e) => {
        e.preventDefault();

        axiosInstance
            .post("posts/", {
                club: getClubId(clubData),
                title: formData.title,
                content: formData.content,
            })
            .then((res) => {
                navigate("/user_profile/");
                navigate("/home/");
            })
            .catch((e) => {
                console.log(e.response.data);
                setTitleErr(e.response.data.title);
                setContentErr(e.response.data.content);
                setClubIDErr(e.response.data.club_id);
            });
    };

    const handleEditRequest = (e) => {
        e.preventDefault();

        axiosInstance
            .put(`posts/${props.personalPost.id}`, {
                action: "edit",
                club: getClubId(clubData),
                title: formData.title,
                content: formData.content,
            })
            .then((res) => {
                navigate("/home/");
                navigate("/user_profile/");
            })
            .catch((e) => {
                console.log(e.response.data);
                setTitleErr(e.response.data.title);
                setContentErr(e.response.data.content);
                setClubIDErr(e.response.data.club_id);
            });
    };

    const getAvailableClubs = () => {
        axiosInstance
            .get(`clubs/user/${currentUser.id}`)
            .then((res) => {
                console.log(res.data);
                const allAvailableClubs = res.data;
                setAvailableClubs(allAvailableClubs);
                console.log("the current user is: " + currentUser.id);
                console.log(availableClubs + "=" + res.data);
            })
            .catch((error) => console.error(error));
    };

    const getClubId = (club) => {
        console.log(clubData);
        for (let i = 0; i < availableClubs.length; ++i) {
            console.log(availableClubs[i]);
            if (availableClubs[i]["name"] === clubData) {
                return availableClubs[i].id;
            }
        }
        return null;
    };

    const displayPersonalPostForm = (e) => {
        return (
            <Container fluid>
                <Row>
                    <Col>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            {props.personalPost === undefined &&
                            <h1> Upload Post </h1>
                            }
                            {props.personalPost !== undefined &&
                            <h1> Edit Post </h1>
                            }
                        </div>

                        <Container>
                            <Form>
                                <FormGroup>
                                    <Label for="title">
                                        {" "}
                                        <h5>
                                            <b> Title </b>
                                        </h5>{" "}
                                    </Label>
                                    {props.personalPost === undefined &&
                                    <Input
                                        id="title"
                                        name="title"
                                        onChange={handleChange}
                                        style={{
                                            border: "0",
                                            backgroundColor: "#F3F3F3",
                                            borderRadius: "20px",
                                        }}
                                    />
                                    }
                                    {props.personalPost !== undefined &&
                                    <Input
                                        id="title"
                                        name="title"
                                        onChange={handleChange}
                                        style={{
                                            border: "0",
                                            backgroundColor: "#F3F3F3",
                                            borderRadius: "20px",
                                        }}
                                        value={formData.title}
                                    />
                                    }
                                </FormGroup>
                                <div>{titleErr}</div>

                                <FormGroup>
                                    <Label for="content">
                                        {" "}
                                        <h5>
                                            <b> Content </b>
                                        </h5>{" "}
                                    </Label>
                                    {props.personalPost === undefined &&
                                    <Input
                                        type="textarea"
                                        rows="5"
                                        id="content"
                                        name="content"
                                        onChange={handleChange}
                                        style={{
                                            border: "0",
                                            backgroundColor: "#F3F3F3",
                                            borderRadius: "20px",
                                        }}
                                    />
                                    }
                                    {props.personalPost !== undefined &&
                                    <Input
                                        type="textarea"
                                        rows="5"
                                        id="content"
                                        name="content"
                                        onChange={handleChange}
                                        style={{
                                            border: "0",
                                            backgroundColor: "#F3F3F3",
                                            borderRadius: "20px",
                                        }}
                                        value={formData.content}
                                    />
                                    }
                                </FormGroup>
                                <div>{contentErr}</div>

                                {availableClubs.length > 0 && (
                                    <Row>
                                        <Col xs="3">
                                            <FormGroup>
                                                <Label for="club_id">
                                                    {" "}
                                                    <h5>
                                                        <b> Club </b> (opt.){" "}
                                                    </h5>{" "}
                                                </Label>
                                                <br/>
                                                <select
                                                    value={clubData}
                                                    onChange={(e) => setClubData(e.target.value)}
                                                    style={{
                                                        border: "0",
                                                        backgroundColor: "#F3F3F3",
                                                        borderRadius: "20px",
                                                    }}
                                                >
                                                    <option/>
                                                    {availableClubs.map((club) => (
                                                        <option> {club.name} </option>
                                                    ))}
                                                </select>
                                            </FormGroup>
                                            <div>{clubIDErr}</div>
                                        </Col>
                                    </Row>
                                )}

                                <FormGroup>
                                    <div style={{display: "flex", justifyContent: "center"}}>
                                        {props.personalPost === undefined &&
                                        <Button
                                            type="submit"
                                            className="submit"
                                            onClick={handlePostFriendRequest}
                                            style={{width: "7rem", borderRadius: "50px"}}
                                        >
                                            Post!
                                        </Button>
                                        }
                                        {props.personalPost !== undefined &&
                                        <Button
                                            type="submit"
                                            className="submit"
                                            onClick={handleEditRequest}
                                            style={{width: "7rem", borderRadius: "50px"}}
                                        >
                                            Save
                                        </Button>
                                        }
                                    </div>
                                </FormGroup>
                            </Form>
                        </Container>
                    </Col>
                </Row>
            </Container>
        );
    };
    return <>{displayPersonalPostForm(props)}</>;
}
