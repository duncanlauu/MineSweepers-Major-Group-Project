/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import Error404 from "../Error404";
import routerWrapper from "../../../test-helpers";


describe("Components exist", () => {

    test("contains header", async () => {
        act(() => {
            render(routerWrapper(<Error404/>))
        })

        await waitFor(() => {
            const headingText = screen.getByText(/404: Page Not Found/i)
            expect(headingText).toBeInTheDocument()
        })
    })

    test("contains error text", async () => {
        act(() => {
            render(routerWrapper(<Error404/>))
        })

        await waitFor(() => {
            expect(screen.getByText("This page is currently in development or does not exist.")).toBeInTheDocument()
        })
    })
})
