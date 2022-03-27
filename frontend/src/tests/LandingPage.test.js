import {render, screen} from '@testing-library/react'
import {BrowserRouter} from "react-router-dom";
import '@testing-library/jest-dom';
import React from "react";
import LandingPage from "../components/LandingPage/LandingPage";


test("Landing Page renders", () => {
    render(<BrowserRouter>
        <LandingPage />
        </BrowserRouter>) // needed because of the use of the useNavigate hook
    expect(screen.getByText("Welcome to")).toBeInTheDocument();
    expect(screen.getByText("bookgle")).toBeInTheDocument();
    expect(screen.getByText('LOG IN').closest('a')).toHaveAttribute('href', '/log_in')
    expect(screen.getByText('SIGN UP').closest('a')).toHaveAttribute('href', '/sign_up')
})