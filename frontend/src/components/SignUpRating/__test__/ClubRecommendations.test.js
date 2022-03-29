/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import ClubRecommendationPage from "../ClubRecommendationsPage";
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

    test("contains header", async () => {
        act(() => {
            render(<BrowserRouter><ClubRecommendationPage/></BrowserRouter>, container)
        })

        await waitFor(() => {
            const headingText = screen.getByText(/Clubs For You/i)
            expect(headingText).toBeInTheDocument()
        })
    })

    test("contains recommender container", async () => {
        act(() => {
            render(<BrowserRouter><ClubRecommendationPage/></BrowserRouter>, container)
        })

        await waitFor(() => {
            expect(screen.getByTestId("recommender_container")).toBeInTheDocument()
        })
    })

    test("contains all clubs", async () => {
        act(() => {
            render(<BrowserRouter><ClubRecommendationPage/></BrowserRouter>, container)
        })

        await waitFor(() => {
            expect(screen.getByText(/Club 1/i)).toBeInTheDocument()
            expect(screen.getByText(/Club 2/i)).toBeInTheDocument()
            expect(screen.getByText(/Club 3/i)).toBeInTheDocument()
            expect(screen.getByText(/Club 4/i)).toBeInTheDocument()
            expect(screen.getByText(/Club 5/i)).toBeInTheDocument()
        })
    })
})
