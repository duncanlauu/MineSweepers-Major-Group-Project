/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import WaitingScreen from "../WaitingScreen";
import routerWrapper from "../../../test-helpers";


describe("Components exist", () => {

    test("contains header", async () => {
        act(() => {
            render(routerWrapper(<WaitingScreen/>));

        })

        await waitFor(() => {
            expect(screen.getByText(`We're getting the account ready for you`)).toBeInTheDocument();
        })
    })

    test("contains subheader", async () => {
        act(() => {
            render(routerWrapper(<WaitingScreen/>));

        })

        await waitFor(() => {
            expect(screen.getByText(`Don't worry, it's only necessary when you sign up for the first time!`)).toBeInTheDocument();
        })
    })
})
