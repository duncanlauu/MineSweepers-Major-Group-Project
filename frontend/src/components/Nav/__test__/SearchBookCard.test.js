/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import SearchBookCard from "../SearchBookCard";
import routerWrapper from "../../../test-helpers";


describe("Components exist", () => {

    test("contains name", async () => {
        act(() => {
            render(routerWrapper(<SearchBookCard name="Name 1" author="Author 1" imageURL="Image 1"/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`Name 1`)).toBeInTheDocument()
        })
    })

    test("contains author", async () => {
        act(() => {
            render(routerWrapper(<SearchBookCard name="Name 1" author="Author 1" imageURL="Image 1"/>))
        })

        await waitFor(() => {
            expect(screen.getByText(`Author 1`)).toBeInTheDocument()
        })
    })

    test("contains cover", async () => {
        act(() => {
            render(routerWrapper(<SearchBookCard name="Name 1" author="Author 1" imageURL="Image 1"/>))
        })

        await waitFor(() => {
            expect(screen.getByAltText(`Book Cover`)).toBeInTheDocument()
        })
    })
})
