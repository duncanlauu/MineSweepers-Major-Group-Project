/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import ClubRecommendationPage from "../ClubRecommendationsPage";
import routerWrapper from "../../../test-helpers";


describe("Components exist", () => {

    test("contains header", async () => {
        act(() => {
            render(routerWrapper(<ClubRecommendationPage/>))
        })

        await waitFor(() => {
            const headingText = screen.getByText(/Clubs For You/i)
            expect(headingText).toBeInTheDocument()
        })
    })

    test("contains recommender container", async () => {
        act(() => {
            render(routerWrapper(<ClubRecommendationPage/>))
        })

        await waitFor(() => {
            expect(screen.getByTestId("recommender_container")).toBeInTheDocument()
        })
    })

    test("contains all clubs", async () => {
        act(() => {
            render(routerWrapper(<ClubRecommendationPage/>))
        })

        await waitFor(() => {
            for (let i = 1; i <= 5; ++i) {
                expect(screen.getByText(`Club ${i}`)).toBeInTheDocument()
            }
        })
    })
})
