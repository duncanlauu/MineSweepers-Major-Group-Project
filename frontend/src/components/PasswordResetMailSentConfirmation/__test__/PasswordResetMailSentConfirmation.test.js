/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import PasswordResetMailSentConfirmation from "../PasswordResetMailSentConfirmation";
import routerWrapper from "../../../test-helpers";


describe("Components exist", () => {

    test("contains header", async () => {
        act(() => {
            render(routerWrapper(<PasswordResetMailSentConfirmation/>))
        })

        await waitFor(() => {
            expect(screen.getByText("Confirmation Sent")).toBeInTheDocument()
        })
    })

    test("contains subheading", async () => {
        act(() => {
            render(routerWrapper(<PasswordResetMailSentConfirmation/>))
        })

        await waitFor(() => {
            expect(screen.getByText("If an account with this email exists, we have sent you instructions for resetting your password.")).toBeInTheDocument()
        })
    })

    test("contains link to Landing page", async () => {
        act(() => {
            render(routerWrapper(<PasswordResetMailSentConfirmation/>))
        })

        await waitFor(() => {
            expect(screen.getByText("Landing page")).toBeInTheDocument()
        })
    })
})
