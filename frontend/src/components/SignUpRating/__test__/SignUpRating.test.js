/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import SignUpRating from "../SignUpRating";
import routerWrapper from "../../../test-helpers";


describe("Components exist", () => {

    test("contains header", async () => {
        act(() => {
            render(routerWrapper(<SignUpRating/>))
        })

        await waitFor(() => {
            expect(screen.getByText(/bookgle/i)).toBeInTheDocument()
        })
    })

    test("contains authors", async () => {
        act(() => {
            render(routerWrapper(<SignUpRating/>))
        })

        await waitFor(() => {
            for (let i = 1; i <= 12; i++) {
                expect(screen.getByText(`Author ${i}`)).toBeInTheDocument()
            }
        })
    })

    test("contains titles", async () => {
        act(() => {
            render(routerWrapper(<SignUpRating/>))
        })

        await waitFor(() => {
            for (let i = 1; i <= 12; i++) {
                expect(screen.getByText(`Title ${i}`)).toBeInTheDocument()
            }
        })
    })

    test("contains finish button", async () => {
        act(() => {
            render(routerWrapper(<SignUpRating/>))
        })

        await waitFor(() => {
            expect(screen.getByText("Finish")).toBeInTheDocument()
        })
    })
})
