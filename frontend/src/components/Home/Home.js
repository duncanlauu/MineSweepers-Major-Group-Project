import { Link } from 'react-router-dom'
import React from 'react';
import { Button } from 'reactstrap';

export default function Home() {
    return (
        <div>
            <h1>Homepage</h1>
            <Link to="/log_out">
                <Button>LOG OUT</Button><br />
            </Link>
            <h3>Logged in User</h3>
        </div>
    )
}