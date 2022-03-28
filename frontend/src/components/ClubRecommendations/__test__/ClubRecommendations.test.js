/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import ClubRecommendationPage from "../ClubRecommendationsPage";
import wrapComponent from "../../../helpers"


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

    test("contains heading", async () => {
        act(() => {
            render(wrapComponent(ClubRecommendationPage), container)
        })

        await waitFor(() => {
            const headingText = screen.getByText(/Clubs For You/i)
            expect(headingText).toBeInTheDocument()
        })
    })
})
