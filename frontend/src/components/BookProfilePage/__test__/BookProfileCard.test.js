/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils';
import BookProfileCard from "../BookProfileCard";
import routerWrapper from "../../../test-helpers";


describe("Components exist", () => {

    test("contains image", async () => {
        act(() => {
            render(routerWrapper(<BookProfileCard image="Image 1" clearable={true} initialRating={1} />))
        })

        await waitFor(() => {
            expect(screen.getByTestId("book-profile-card-image")).toBeInTheDocument()
        })
    })

    test("contains clear button if clearable", async () => {
        act(() => {
            render(routerWrapper(<BookProfileCard image="Image 1" clearable={true} initialRating={1} />))
        })

        await waitFor(() => {
            expect(screen.getByText("Clear")).toBeInTheDocument()
        })
    })

    test("does not contain clear button if not clearable", async () => {
        act(() => {
            render(routerWrapper(<BookProfileCard image="Image 1" clearable={false} initialRating={1} />))
        })

        await waitFor(() => {
            const clearButton = screen.queryByText("Clear")
            expect(clearButton).not.toBeInTheDocument()

        })
    })
})