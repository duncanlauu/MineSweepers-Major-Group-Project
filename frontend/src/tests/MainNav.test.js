import {render, screen} from '@testing-library/react'
import {BrowserRouter} from "react-router-dom";
import '@testing-library/jest-dom';
import React from "react";
import MainNav from "../components/Nav/MainNav";


test("Main nav renders", async () => {
    // render(<BrowserRouter>
    //     <MainNav />
    //     </BrowserRouter>) // needed because of the use of the useNavigate hook
})