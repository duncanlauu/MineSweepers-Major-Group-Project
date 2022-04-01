/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import SingleClubRecommendation from "../SingleClubRecommendation";
import routerWrapper from "../../../test-helpers";


describe("Components exist", () => {

    test("contains club name", async () => {
        act(() => {
            render(routerWrapper(<SingleClubRecommendation club={{
                "owner": {"email": "user2@example.org"},
                "name": "Club 1",
                "id": 1
            }}/>))
        })

        await waitFor(() => {
            const clubName = screen.getByText(/Club 1/i)
                expect(clubName).toBeInTheDocument()
        })
    })

    test("contains gravatar", async () => {
        act(() => {
            render(routerWrapper(<SingleClubRecommendation club={{
                "owner": {"email": "user2@example.org"},
                "name": "Club 1",
                "id": 1
            }}/>))
        })

        await waitFor(() => {
            expect(screen.getByTestId("gravatar")).toBeInTheDocument()
        })
    })
})
