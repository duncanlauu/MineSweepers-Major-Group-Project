/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import Scheduling from "../Scheduling";
import {useParams} from "../../../__mocks__/react-router-dom";
import routerWrapper from "../../../test-helpers";


describe("Components exist", () => {

    test("contains header", async () => {
        act(() => {
            useParams.mockReturnValue(1)
            render(routerWrapper(<Scheduling/>))
        })

        await waitFor(() => {
            const headingText = screen.getByText(/Please wait for the book recommendations/i)
            expect(headingText).toBeInTheDocument()
        })
    })
})
