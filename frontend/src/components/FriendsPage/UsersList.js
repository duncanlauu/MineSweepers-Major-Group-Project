import React, {useEffect, useState} from "react"


export default function UsersList(props) {

    const [usersList, setUsersList] = useState([])

    const navigate = useNavigate();

    useEffect(() => {
        setUsersList(props.usersList);
    }, []);

    if (usersList.length > 0) {
        return (
            usersList.map((nonFriend, index) => {
                console.log(nonFriend);
                return (
                    <div className="friend" key={nonFriend.id}>
                        <Row>
                            <Col xs="2">
                                <Gravatar email={nonFriend.email} size={20} style={{ 
                                            borderRadius: "50px",
                                            marginTop: "1rem",
                                            marginBottom: "1rem"
                                        }} 
                                    />
                            </Col>
                            <Col xs="6">
                                <h5 className="friend_username"> {nonFriend.username} </h5>
                            </Col>
                            <Col xs="4">
                                <Button style={{width: "3rem"}} onClick={(e) => postFriendRequest(nonFriend.id)}>
                                    <p> ::</p>
                                </Button>
                                <Button style={{width: "2rem"}} onClick={(e) => cancelFriendRequest(nonFriend.id)}>
                                    <p> X </p>
                                </Button>
                            </Col>
                        </Row>
                    </div>
                )
            })
        )
    } else {
        return (<h3> {props.emptyMessage} </h3>)
    
    }

}



