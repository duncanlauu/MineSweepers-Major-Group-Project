/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import BookRatingCard from "../BookRatingCard";
import routerWrapper from "../../../test-helpers";


describe("Components exist", () => {

    test("contains all elements", async () => {
        act(() => {
            render(routerWrapper(<BookRatingCard title="Title 1" author="Author 1" image="Image 1" id="1"/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/Title 1/i)).toBeInTheDocument()
            expect(screen.getByText(/Author 1/i)).toBeInTheDocument()
            expect(screen.getByTestId("stars")).toBeInTheDocument()
            expect(screen.getByText(/Clear/i)).toBeInTheDocument()
        })
    })
})
