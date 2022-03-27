import {render, screen} from '@testing-library/react'
import {BrowserRouter} from "react-router-dom";
import '@testing-library/jest-dom';
import React from "react";
import Home from "../components/Home/Home";


test("Main nav renders", async () => {
    // TODO: axios
    // render(<BrowserRouter>
    //     <Home />
    //     </BrowserRouter>) // needed because of the use of the useNavigate hook
    // expect(screen.getByText('LOG OUT').closest('a')).toHaveAttribute('href', '/log_out')
    // expect(screen.getByText('GO TO HELLO').closest('a')).toHaveAttribute('href', '/hello')
})