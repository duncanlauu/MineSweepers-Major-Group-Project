import React, {useEffect, useState} from "react";
import {Row, Col} from "reactstrap";
import Gravatar from "react-gravatar";

export default function LikesUsersList(props) {
    const [likesUsersList, setLikesUsersList] = useState([]);

    useEffect(() => {
        props.getLikesUsersList(setLikesUsersList);
    }, []);

    if (likesUsersList.length > 0) {
        return likesUsersList.map((user) => {
            return (
                <div className="user" key={user.id}>
                    <Row>
                        <Col xs="2">
                            <Gravatar
                                email={user.email}
                                size={20}
                                style={{
                                    borderRadius: "50px",
                                    marginTop: "1rem",
                                    marginBottom: "1rem",
                                }}
                            />
                        </Col>
                        <Col xs="6">
                            <a href={`/user_profile/${user.id}`}>
                                <h5 className="user_username" style={{ fontFamily:"Source Sans Pro" }}> {user.username} </h5>
                            </a>
                        </Col>
                    </Row>
                </div>
            );
        });
    } else {
        return <h3> {`This ${props.type} has no likes yet...`} </h3>;
    }
}
