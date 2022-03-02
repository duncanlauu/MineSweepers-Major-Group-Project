import React from "react"
import {Row, Col, Button} from "reactstrap"

export default function FriendRequests(props){
    console.log(props)
    // return(<></>)

    const displayFriendRequests = (props) => {
        const {menu, myFriendRequests} = props;

        if(myFriendRequests.length > 0) {
            return(
                myFriendRequests.map((friendRequest, index) => {
                    console.log(friendRequest);
                    return(
                        <div className="friendRequest" key={friendRequest.id}>
                            <Row>
                                <Col>
                                    <p> test </p>
                                </Col>
                                <Col>
                                    <Button> 
                                        <p> test </p>
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    )
                })
            )
        } else {
            return (<h3> You don't have any friend requests yet. </h3>)
            
        }
    }
    return(
        <> 
            {displayFriendRequests(props)}
        </>
    )

}