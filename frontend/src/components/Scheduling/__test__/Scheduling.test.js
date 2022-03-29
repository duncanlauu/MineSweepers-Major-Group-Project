/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom'
import {act} from 'react-dom/test-utils';
import Scheduling from "../Scheduling";
import {useParams} from "../../../__mocks__/react-router-dom";
import {BrowserRouter} from "react-router-dom";


let container

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    document.body.removeChild(container);
    container = null;
});


describe("Components exist", () => {

    test("contains header", async () => {
        act(() => {
            useParams.mockReturnValue(1)
            render(<BrowserRouter><Scheduling/></BrowserRouter>, container)
        })

        await waitFor(() => {
            const headingText = screen.getByText(/Please wait for the book recommendations/i)
            expect(headingText).toBeInTheDocument()
        })
    })
})
