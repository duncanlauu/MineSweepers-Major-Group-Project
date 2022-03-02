import React from "react"
import {Row, Col, Button} from "reactstrap"

import axiosInstance from '../../axios'

export default function FriendList(props){

    // console.log(props)
    // return(<></>)


    const deleteFriend = (id) => {
        axiosInstance
          .delete(`friends/${id}`)
          .then((res) => {
            //navigate("/log_in/") // for test purpose - does api get request fail?
            console.log(res)
          })
          .catch(error => console.error(error));
      }


    const displayFriends = (props) => {
        const {menu, myFriends} = props;

        if(myFriends.length > 0) {
            return(
                myFriends.map((friend, index) => {
                    console.log(friend);
                    return(
                        <div className="friend" key={friend.id}>
                            <Row>
                                <Col>
                                    <h3 className="friend_username"> {friend.username} </h3>
                                    <p className="friend_email"> {friend.email} </p>
                                </Col>
                                <Col>
                                    <Button> 
                                        {friend.id} 
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    )
                })
            )
        } else {
            return (<h3> You don't have any friend connections yet. </h3>)
            
        }
    }
    return(
        <> 
            {displayFriends(props)}
        </>
    )

}