/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils';
import BookProfilePage from "../BookProfilePage";
import { MemoryRouter } from "react-router";


jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
    useParams: () => ({
        book_id: '0195153448'
    }),
    useRouteMatch: () => ({ url: '/book_profile/0195153448' }),
}));

describe("Components exist", () => {

    test("contains image", async () => {

        act(() => {
            render(<BookProfilePage />, { wrapper: MemoryRouter })
        })

        await waitFor(() => {
            expect(screen.getByTestId("book-profile-card-image")).toBeInTheDocument()
        })
    })

    test("does not contain clear button since already rated", async () => {
        act(() => {
            render(<BookProfilePage/>, {wrapper: MemoryRouter})
        })

        await waitFor(() => {
            const clearButton = screen.queryByText("Clear")
            expect(clearButton).not.toBeInTheDocument()

        })
    })

    // test("contains update rating button", async () => {
    //     act(() => {
    //         render(<BookProfilePage/>, {wrapper: MemoryRouter})
    //     })
    //
    //     await waitFor(() => {
    //         expect(screen.getByText("Update Rating")).toBeInTheDocument()
    //     })
    // })
    //
    // test("contains title", async () => {
    //     act(() => {
    //         render(<BookProfilePage/>, {wrapper: MemoryRouter})
    //     })
    //
    //     await waitFor(() => {
    //         expect(screen.getByText("Classical Mythology")).toBeInTheDocument()
    //     })
    // })
    //
    // test("contains author", async () => {
    //     act(() => {
    //         render(<BookProfilePage/>, {wrapper: MemoryRouter})
    //     })
    //
    //     await waitFor(() => {
    //         expect(screen.getByText("Mark P. O. Morford")).toBeInTheDocument()
    //     })
    // })
    //
    // test("contains publication date", async () => {
    //     act(() => {
    //         render(<BookProfilePage/>, {wrapper: MemoryRouter})
    //     })
    //
    //     await waitFor(() => {
    //         expect(screen.getByText("2002")).toBeInTheDocument()
    //     })
    // })
    //
    // test("contains genre", async () => {
    //     act(() => {
    //         render(<BookProfilePage/>, {wrapper: MemoryRouter})
    //     })
    //
    //     await waitFor(() => {
    //         expect(screen.getByText("Social Science")).toBeInTheDocument()
    //     })
    // })
    //
    // test("contains publisher", async () => {
    //     act(() => {
    //         render(<BookProfilePage/>, {wrapper: MemoryRouter})
    //     })
    //
    //     await waitFor(() => {
    //         expect(screen.getByText("Oxford University Press")).toBeInTheDocument()
    //     })
    // })

    test("contains recommendations button", async () => {
        act(() => {
            render(<BookProfilePage/>, {wrapper: MemoryRouter})
        })

        await waitFor(() => {
            expect(screen.getByText("See your recommendations")).toBeInTheDocument()
        })
    })
})