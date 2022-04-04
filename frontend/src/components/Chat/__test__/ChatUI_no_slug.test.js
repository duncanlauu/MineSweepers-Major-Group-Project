/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils';
import ChatUI from '../ChatUI';
import fakeLocalStorage from "../../../fakeLocalStorage";
import user from "../../../mocksData/getCurrentUser.json";
import routerWrapper from "../../../test-helpers";

beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
        value: fakeLocalStorage,
    });
});

beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem("user", JSON.stringify(user));
    window.HTMLElement.prototype.scrollIntoView = function () { };
});

afterEach(() => {
    window.localStorage.clear();
})

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
    }),
}))

describe('Chat components without any chat openend contains elements', () => {
    test('contains outbox image', async () => {
        act(() => {
            render(routerWrapper(<ChatUI />));
        })

        await waitFor(() => {
            const outbox = screen.getByRole('img', { name: /outbox/i })
            expect(outbox).toBeInTheDocument()
        })
    })

    test('contains placeholder text', async () => {
        act(() => {
            render(routerWrapper(<ChatUI />));
        })

        await waitFor(() => {
            const placeholder = screen.getByText(/send messages to individual usersor a club you're part of\./i)
            expect(placeholder).toBeInTheDocument()
        })
    })
})