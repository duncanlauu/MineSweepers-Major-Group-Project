/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import PasswordResetConfirm from "../PasswordResetConfirm";
import routerWrapper from "../../../test-helpers";


describe("Components exist", () => {

    test("contains header", async () => {
        act(() => {
            render(routerWrapper(<PasswordResetConfirm/>))
        })

        await waitFor(() => {
            expect(screen.getByText("Password Reset")).toBeInTheDocument()
        })
    })

    test("contains new password label", async () => {
        act(() => {
            render(routerWrapper(<PasswordResetConfirm/>))
        })

        await waitFor(() => {
            expect(screen.getByText("New Password")).toBeInTheDocument()
            expect(screen.getByTestId("new_password")).toBeInTheDocument()
        })
    })

    test("contains new password field", async () => {
        act(() => {
            render(routerWrapper(<PasswordResetConfirm/>))
        })

        await waitFor(() => {
            expect(screen.getByText("New Password")).toBeInTheDocument()
            expect(screen.getByTestId("new_password")).toBeInTheDocument()
            expect(screen.getByTestId("new_password_errors")).toBeInTheDocument()
        })
    })

    test("contains confirm new password field", async () => {
        act(() => {
            render(routerWrapper(<PasswordResetConfirm/>))
        })

        await waitFor(() => {
            expect(screen.getByText("Confirm New Password")).toBeInTheDocument()
            expect(screen.getByTestId("re_new_password")).toBeInTheDocument()
            expect(screen.getByTestId("re_new_password_errors")).toBeInTheDocument()
        })
    })

    test("contains reset button", async () => {
        act(() => {
            render(routerWrapper(<PasswordResetConfirm/>))
        })

        await waitFor(() => {
            expect(screen.getByText("Reset")).toBeInTheDocument()
        })
    })
})
