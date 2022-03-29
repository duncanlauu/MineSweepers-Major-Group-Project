/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import SingleClubRecommendation from "../SingleClubRecommendation";
import wrapComponent from "../../../helpers"
import {BrowserRouter} from "react-router-dom";


let container

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    document.body.removeChild(container);
    container = null;
});


describe("Components exist", () => {

    test("contains club name", async () => {
        act(() => {
            render(<BrowserRouter><SingleClubRecommendation club={{
                "owner": {"email": "user2@example.org"},
                "name": "Club 1",
                "id": 1
            }}/></BrowserRouter>, container)
        })

        await waitFor(() => {
            const clubName = screen.getByText(/Club 1/i)
                expect(clubName).toBeInTheDocument()
        })
    })

    test("contains gravatar", async () => {
        act(() => {
            render(<BrowserRouter><SingleClubRecommendation club={{
                "owner": {"email": "user2@example.org"},
                "name": "Club 1",
                "id": 1
            }}/></BrowserRouter>, container)
        })

        await waitFor(() => {
            expect(screen.getByTestId("gravatar")).toBeInTheDocument()
        })
    })
})
