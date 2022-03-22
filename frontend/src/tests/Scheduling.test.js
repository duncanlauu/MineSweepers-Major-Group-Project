import Scheduling from "../components/Scheduling/Scheduling";
import {render, screen, waitFor} from '@testing-library/react'
import {BrowserRouter} from "react-router-dom";
import '@testing-library/jest-dom';
import React from "react";
import {wait} from "@testing-library/user-event/dist/utils";
import exp from "constants";

jest.setTimeout(35000);

test("renders", async () => {
    render(<BrowserRouter>
        <Scheduling/>
    </BrowserRouter>) // needed because of the use of the useNavigate hook
    expect(screen.getByTestId("waiting_message")).toBeInTheDocument();
    // This needs to wait until the state is updated
    await waitFor(() => expect(screen.getByTestId("form")).toBeInTheDocument())
    expect(screen.getByTestId("name")).toBeInTheDocument();
    expect(screen.getByTestId("description")).toBeInTheDocument();
    expect(screen.getByTestId("book")).toBeInTheDocument();
    expect(screen.getByTestId("start_time")).toBeInTheDocument();
    expect(screen.getByTestId("end_time")).toBeInTheDocument();
    expect(screen.getByTestId("link")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
})