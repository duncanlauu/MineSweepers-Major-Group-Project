/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import SingleBookRating from "../SingleBookRating";
import routerWrapper from "../../../../test-helpers";


describe("Components exist", () => {

    test("contains book's cover", async () => {
        act(() => {
            render(routerWrapper(<SingleBookRating book_id={"0195153448"}/>))
        })

        await waitFor(() => {
            expect(screen.getByAltText("Book's cover")).toBeInTheDocument()
        })
    })

    test("contains title", async () => {
        act(() => {
            render(routerWrapper(<SingleBookRating book_id={"0195153448"}/>))
        })

        await waitFor(() => {
            expect(screen.getByText("Classical Mythology")).toBeInTheDocument()
        })
    })

    test("contains rating stars", async () => {
        act(() => {
            render(routerWrapper(<SingleBookRating book_id={"0195153448"}/>))
        })

        await waitFor(() => {
            expect(screen.getByTestId("rating")).toBeInTheDocument()
        })
    })
})
