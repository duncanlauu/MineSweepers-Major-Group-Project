/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import PasswordReset from "../PasswordReset";
import routerWrapper from "../../../test-helpers";


describe("Components exist", () => {

    test("contains header", async () => {
        act(() => {
            render(routerWrapper(<PasswordReset/>))
        })

        await waitFor(() => {
            expect(screen.getByText("Forgot your Password?")).toBeInTheDocument()
        })
    })

    test("contains snarky text", async () => {
        act(() => {
            render(routerWrapper(<PasswordReset/>))
        })

        await waitFor(() => {
            expect(screen.getByText("Don't worry, it happens to the best of us.")).toBeInTheDocument()
        })
    })

    test("contains email input field", async () => {
        act(() => {
            render(routerWrapper(<PasswordReset/>))
        })

        await waitFor(() => {
            expect(screen.getByText("Email")).toBeInTheDocument()
            expect(screen.getByTestId("email")).toBeInTheDocument()
        })
    })

    test("contains reset button", async () => {
        act(() => {
            render(routerWrapper(<PasswordReset/>))
        })

        await waitFor(() => {
            expect(screen.getByText("Send Reset Email")).toBeInTheDocument()
        })
    })
})
