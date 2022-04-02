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
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        chatID: '21'
    }),
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

    describe('Delete Chat Functionality', () => {

        test('delete removes selected chat', async () => {
            act(() => {
                render(<ChatUI />, { wrapper: MemoryRouter });
            })

            await waitFor(() => {
                const deleteConversationButton = screen.getByRole('img', { name: /delete chat/i })
                fireEvent.click(deleteConversationButton)
                const deletedConversation = screen.queryAllByText(/billie/i)
                expect(deletedConversation).toHaveLength(0)
            })
        })

        test('delete chat shows conversation placeholder', async () => {
            act(() => {
                render(<ChatUI />, { wrapper: MemoryRouter });
            })

            await waitFor(() => {
                const deleteConversationButton = screen.getByRole('img', { name: /delete chat/i })
                fireEvent.click(deleteConversationButton)
                const placeholder = screen.getByText(/start the conversation\./i)
                expect(placeholder).toBeInTheDocument()
            })
        })


    })

    describe('Send button functionality', () => {

        // displaying messages is only tested with selenium due to issues with mocking the websocket. 

        test('send message button clears input field', async () => {
            act(() => {
                render(<ChatUI />, { wrapper: MemoryRouter });
            })

            await waitFor(() => {
                const sendMessageButton = screen.getByRole('img', { name: /send icon/i })
                fireEvent.click(sendMessageButton)
                const inputField = screen.getByRole('textbox')
                expect(inputField).toBeEmpty()
            })
        })
    })
})



