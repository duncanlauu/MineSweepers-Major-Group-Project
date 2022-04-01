/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils';
import ChatUI from '../ChatUI';
import routerWrapper from '../../../test-helpers'
import fakeLocalStorage from "../../../fakeLocalStorage";
import user from "../../../mocksData/getCurrentUser.json";
import { MemoryRouter, Route, Routes } from 'react-router-dom'


beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
        value: fakeLocalStorage,
    });
});

beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem("user", JSON.stringify(user));
});

afterEach(() => {
    window.localStorage.clear();
})

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
    useParams: () => ({
        chatID: '19'
    }),
    useRouteMatch: () => ({ url: '/chat/19' }),
}));

describe('Components exist', () => {

    test('contains heading', async () => {

        window.HTMLElement.prototype.scrollIntoView = function () { };

        act(() => {
            render(<ChatUI />, { wrapper: MemoryRouter });
        })

        await waitFor(() => {
            const headingText = screen.getByText(/conversations/i)
            expect(headingText).toBeInTheDocument()
        })
    })

    // test 
    // 1. no chats and 
    // club + one friend
    // --> Need to specify option with which JSON to return
})