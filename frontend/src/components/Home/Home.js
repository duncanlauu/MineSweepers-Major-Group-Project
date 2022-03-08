import { Link } from 'react-router-dom'
import { Button } from 'reactstrap';
import useGetUser from '../../helpers';
import React from 'react'

export default function Home() {

    const user = useGetUser(); // custom hook to get user
    return (
        <div>
            <h1>Homepage</h1>
            <Link to="/log_out">
                <Button>LOG OUT</Button><br />
            </Link>
            <h3>{user.username}</h3>
        </div>
    )
}
