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

    test("contains title", async () => {
        act(() => {
            render(routerWrapper(<BookRatingCard title="Title 1" author="Author 1" image="Image 1" id="1"/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/Title 1/i)).toBeInTheDocument()
        })
    })

    test("contains author", async () => {
        act(() => {
            render(routerWrapper(<BookRatingCard title="Title 1" author="Author 1" image="Image 1" id="1"/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/Author 1/i)).toBeInTheDocument()
        })
    })

    test("contains stars", async () => {
        act(() => {
            render(routerWrapper(<BookRatingCard title="Title 1" author="Author 1" image="Image 1" id="1"/>))
        })

        await waitFor(() => {
            expect(screen.getByTestId("stars")).toBeInTheDocument()
        })
    })

    test("contains button", async () => {
        act(() => {
            render(routerWrapper(<BookRatingCard title="Title 1" author="Author 1" image="Image 1" id="1"/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/Clear/i)).toBeInTheDocument()
        })
    })
})
