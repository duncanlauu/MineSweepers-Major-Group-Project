/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils';
import ChatUI from '../ChatUI';
import fakeLocalStorage from "../../../fakeLocalStorage";
import user from "../../../mocksData/getCurrentUser.json";
import { MemoryRouter } from 'react-router-dom'


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
    ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
    useParams: () => ({
        chatID: '21'
    }),
    useRouteMatch: () => ({ url: '/chat/21' }),
}));

describe('Components exist', () => {

    describe('Sidepanel components exits', () => {

        test('contains Sidepanel heading', async () => {
            act(() => {
                render(<ChatUI />, { wrapper: MemoryRouter });
            })

            await waitFor(() => {
                const headingText = screen.getByText(/conversations/i)
                expect(headingText).toBeInTheDocument()
            })
        })

        test('contains name for personal chat', async () => {
            act(() => {
                render(<ChatUI />, { wrapper: MemoryRouter });
            })

            await waitFor(() => {
                const personalChat = screen.getByText(/billie/i)
                expect(personalChat).toBeInTheDocument()
            })
        })

        test('contains gravatar for personal chat', async () => {
            act(() => {
                render(<ChatUI />, { wrapper: MemoryRouter });
            })

            await waitFor(() => {
                const personalGravatar = screen.getByRole('img', { name: /gravatar for billie@example\.org/i })
                expect(personalGravatar).toBeInTheDocument()
            })
        })

        test('contains name for group chat', async () => {
            act(() => {
                render(<ChatUI />, { wrapper: MemoryRouter });
            })

            await waitFor(() => {
                const groupChat = screen.getByText(/testclub2/i)
                expect(groupChat).toBeInTheDocument()
            })
        })

        test('contains gravatar for group chat', async () => {
            act(() => {
                render(<ChatUI />, { wrapper: MemoryRouter });
            })

            await waitFor(() => {
                const groupGravatar = screen.getByRole('img', { name: /gravatar for jeb@example\.org/i })
                expect(groupGravatar).toBeInTheDocument()
            })
        })

        test('contains most recent message of group chat', async () => {
            act(() => {
                render(<ChatUI />, { wrapper: MemoryRouter });
            })

            await waitFor(() => {
                const lastMessage = screen.getByText(/hi/i)
                expect(lastMessage).toBeInTheDocument()
            })
        })

    })

    describe('Chat components exists', () => {

        test('contains input field', async () => {
            act(() => {
                render(<ChatUI />, { wrapper: MemoryRouter });
            })

            await waitFor(() => {
                const inputField = screen.getByRole('textbox')
                expect(inputField).toBeInTheDocument()
            })
        })

        test('contains emtpy conversation placeholder', async () => {
            act(() => {
                render(<ChatUI />, { wrapper: MemoryRouter });
            })

            await waitFor(() => {
                const placeholder = screen.getByText(/start the conversation\./i)
                expect(placeholder).toBeInTheDocument()
            })
        })

        test('contains send message button', async () => {
            act(() => {
                render(<ChatUI />, { wrapper: MemoryRouter });
            })

            await waitFor(() => {
                const sendMessageButton = screen.getByRole('img', { name: /send icon/i })
                expect(sendMessageButton).toBeInTheDocument()
            })
        })

        test('contains delete conversation button', async () => {
            act(() => {
                render(<ChatUI />, { wrapper: MemoryRouter });
            })

            await waitFor(() => {
                const deleteConversationButton = screen.getByRole('img', { name: /delete chat/i })
                expect(deleteConversationButton).toBeInTheDocument()
            })
        })

    })
    // // this needs a get request without slug
    // describe('Chat components without any chat openend contains elements', () => {
    //     test('contains outbox image', async () => {
    //         act(() => {
    //             render(<ChatUI />, { wrapper: MemoryRouter });
    //         })

    //         await waitFor(() => {
    //             const outbox = screen.getByRole('img', { name: /outbox/i })
    //             expect(outbox).toBeInTheDocument()
    //         })
    //     })

    //     test('contains placeholder text', async () => {
    //         act(() => {
    //             render(<ChatUI />, { wrapper: MemoryRouter });
    //         })

    //         await waitFor(() => {
    //             const placeholder = screen.getByText(/send messages to individual usersor a club you're part of\./i)
    //             expect(placeholder).toBeInTheDocument()
    //         })
    //     })
    // })

    // test 
    // 1. no chats and 
    // club + one friend
    // --> Need to specify option with which JSON to return
})