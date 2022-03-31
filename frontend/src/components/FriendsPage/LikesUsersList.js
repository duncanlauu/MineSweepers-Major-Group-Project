import React, {useEffect, useState} from "react"


export default function UsersList(props) {

    const [usersList, setUsersList] = useState([])

    useEffect(() => {
        fillLikesUsersList()
    }, []);

    const fillLikesUsersList = () => {
        console.log(props.feedPost.upvotes)
    }

    if (usersList.length > 0) {
        return (
            usersList.map((user, index) => {
                return (
                    <div className="user" key={user.id}>
                        <Row>
                            <Col xs="2">
                                <Gravatar email={user.email} size={20} style={{ 
                                            borderRadius: "50px",
                                            marginTop: "1rem",
                                            marginBottom: "1rem"
                                        }} 
                                    />
                            </Col>
                            <Col xs="6">
                                <h5 className="user_username"> {user.username} </h5>
                            </Col>
                        </Row>
                    </div>
                )
            })
        )
    } else {
        return (<h3> {"This post has no likes yet..."} </h3>)
    
    }

}



