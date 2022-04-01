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


describe('Components exist', () => {

    test('contains heading', async () => {
        act(() => {
            render(routerWrapper(<ChatUI />))
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