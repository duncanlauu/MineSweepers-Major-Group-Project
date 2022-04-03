import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import Gravatar from "react-gravatar";
import axiosInstance from "../../axios";

export default function LikesUsersList(props) {
  const [likesUsersList, setLikesUsersList] = useState([]);

  useEffect(() => {
    getLikesUsersList();
  }, []);

  const getLikesUsersList = () => {
    axiosInstance
      .get(`posts/${props.post.id}`)
      .then((res) => {
        setLikesUsersList(res.data.post.upvotes);
      })
      .catch((error) => console.error(error));
  };

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
              <h5 className="user_username"> {user.username} </h5>
            </Col>
          </Row>
        </div>
      );
    });
  } else {
    return <h3> {"This post has no likes yet..."} </h3>;
  }
}
