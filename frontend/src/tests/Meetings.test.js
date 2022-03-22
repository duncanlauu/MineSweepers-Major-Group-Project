import {render, screen, } from "@testing-library/react";
import {BrowserRouter} from "react-router-dom";
import React from "react";
import Meetings from "../components/Meetings/Meetings"
import '@testing-library/jest-dom';

test("renders", async () => {
    render(<BrowserRouter>
        <Meetings />
    </BrowserRouter>) // needed because of the use of the useNavigate hook
    expect(screen.getByTestId("waiting_message")).toBeInTheDocument();
    // This needs to wait until the state is updated
    // I think the user needs to be authenticated
})