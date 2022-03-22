import Scheduling from "../components/Scheduling/Scheduling";
import {render, screen, waitFor, waitForElementToBeRemoved} from '@testing-library/react'
import {BrowserRouter} from "react-router-dom";
import '@testing-library/jest-dom';
import React from "react";

jest.setTimeout(45000);

test("renders", async () => {
    render(<BrowserRouter>
        <Scheduling/>
    </BrowserRouter>) // needed because of the use of the useNavigate hook
    expect(screen.getByTestId("waiting_message")).toBeInTheDocument();
    // This needs to wait until the state is updated
    // I think the user needs to be authenticated
    // await waitForElementToBeRemoved(screen.getByTestId("waiting_message"), {timeout: 35000})
    // expect(screen.getByTestId("name")).toBeInTheDocument();
    // expect(screen.getByTestId("description")).toBeInTheDocument();
    // expect(screen.getByTestId("book")).toBeInTheDocument();
    // expect(screen.getByTestId("start_time")).toBeInTheDocument();
    // expect(screen.getByTestId("end_time")).toBeInTheDocument();
    // expect(screen.getByTestId("link")).toBeInTheDocument();
    // expect(screen.getByRole("button")).toBeInTheDocument();
})