/**
 * @jest-environment jsdom
 */

import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils';
import fakeLocalStorage from "../../../fakeLocalStorage";
import user from "../../../mocksData/getCurrentUser.json"
import renderClubProfile from './clubProfileHelper';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        club_id: '15',
    }),
}))

beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
        value: fakeLocalStorage,
    });
});

beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem("user", JSON.stringify(user));
});


describe('User is admin', () => {

    const role = 'admin'

    // test('contains name of club', async () => {

    //     act(() => {
    //         renderClubProfile(role);
    //     })

    //     await waitFor(() => {
    //         const headingText = screen.getByText(/Hayesberg Book Club/i)
    //         expect(headingText).toBeInTheDocument()
    //     })
    // })

    // describe('Correct tabs are shown', () => {

    //     test('contains profile tab', async () => {

    //         act(() => {
    //             renderClubProfile(role);
    //         })

    //         await waitFor(() => {
    //             const profileTab = screen.getByRole('tab', { name: /profile/i })
    //             expect(profileTab).toBeInTheDocument()
    //         })
    //     })

    //     test('contains members tab', async () => {

    //         act(() => {
    //             renderClubProfile(role);
    //         })

    //         await waitFor(() => {
    //             const membersTab = screen.getByRole('tab', { name: /members/i })
    //             expect(membersTab).toBeInTheDocument()
    //         })
    //     })

    //     test('contains feed tab', async () => {

    //         act(() => {
    //             renderClubProfile(role);
    //         })

    //         await waitFor(() => {
    //             const feedTab = screen.getByRole('tab', { name: /feed/i })
    //             expect(feedTab).toBeInTheDocument()
    //         })
    //     })

    //     test('contains meetings tab', async () => {

    //         act(() => {
    //             renderClubProfile(role);
    //         })

    //         await waitFor(() => {
    //             const meetingsTab = screen.getByRole('tab', { name: /meetings/i })
    //             expect(meetingsTab).toBeInTheDocument()
    //         })
    //     })
    // })

    // describe('Profile tab shows correct contents', () => {

    //     test('shows club description', async () => {

    //         act(() => {
    //             renderClubProfile(role);
    //         })

    //         await waitFor(() => {
    //             const description = screen.getByText(/fuga quo provident nobis\. eveniet omnis pariatur quisquam adipisci\. a dignissimos non tenetur autem earum\./i)
    //             expect(description).toBeInTheDocument()
    //         })
    //     })

    //     test('shows owners Gravatar', async () => {

    //         act(() => {
    //             renderClubProfile(role);
    //         })

    //         await waitFor(() => {
    //             const ownerGravatar = screen.getByRole('img', { name: /gravatar for stephenwatson@example\.org/i })
    //             expect(ownerGravatar).toBeInTheDocument()
    //         })
    //     })

    //     test('shows leave club button', async () => {

    //         act(() => {
    //             renderClubProfile(role);
    //         })

    //         await waitFor(() => {
    //             const leaveClub = screen.getByRole('button', { name: /leave club/i })
    //             expect(leaveClub).toBeInTheDocument()
    //         })
    //     })

    //     test('clicking leave club button toggles it to show apply', async () => {

    //         act(() => {
    //             renderClubProfile(role);
    //         })

    //         const leaveClub = await screen.findByRole('button', { name: /leave club/i })
    //         fireEvent.click(leaveClub)

    //         const applyButton = await screen.findByRole('button', { name: /apply/i })
    //         expect(applyButton).toBeInTheDocument()

    //     })



    //     describe('does not show content for users with different relationship to club', () => {

    //         test('does not show apply button', async () => {

    //             act(() => {
    //                 renderClubProfile(role);
    //             })

    //             await waitFor(() => {
    //                 const apply = screen.queryAllByRole('button', { name: /apply/i })
    //                 expect(apply).toHaveLength(0)
    //             })
    //         })

    //         test('does not show you are banned text', async () => {

    //             act(() => {
    //                 renderClubProfile(role);
    //             })

    //             await waitFor(() => {
    //                 const bannedText = screen.queryAllByText(/you are banned from this club/i)
    //                 expect(bannedText).toHaveLength(0)
    //             })
    //         })

    //         test('does not show transfer ownership text', async () => {

    //             act(() => {
    //                 renderClubProfile(role);
    //             })

    //             await waitFor(() => {
    //                 const transferOwnership = screen.queryAllByText(/if you would like to leave the club, please transfer the ownership/i)
    //                 expect(transferOwnership).toHaveLength(0)
    //             })
    //         })

    //         test('does not show withdraw application text', async () => {

    //             act(() => {
    //                 renderClubProfile(role);
    //             })

    //             await waitFor(() => {
    //                 const withdrawApplication = screen.queryAllByRole('button', { name: /withdraw application/i })
    //                 expect(withdrawApplication).toHaveLength(0)
    //             })
    //         })
    //     })

    //     describe('Reading history', () => {
    //         test('shows reading history heading', async () => {

    //             act(() => {
    //                 renderClubProfile(role);
    //             })

    //             await waitFor(() => {
    //                 const readingHistory = screen.getByRole('heading', { name: /reading history/i })
    //                 expect(readingHistory).toBeInTheDocument()
    //             })
    //         })

    //         test('shows correct first book', async () => {

    //             act(() => {
    //                 renderClubProfile(role);
    //             })

    //             await waitFor(() => {
    //                 const bookTitle = screen.getByText(/the master of petersburg/i)
    //                 expect(bookTitle).toBeInTheDocument()
    //             })
    //         })

    //         test('shows correct first books author and year of release', async () => {

    //             act(() => {
    //                 renderClubProfile(role);
    //             })

    //             await waitFor(() => {
    //                 const authorRelease = screen.getByText(/j\. m\. coetzee, 1995/i)
    //                 expect(authorRelease).toBeInTheDocument()
    //             })
    //         })

    //         test('shows correct amount of books in reading history', async () => {

    //             act(() => {
    //                 renderClubProfile(role);
    //             })

    //             await waitFor(() => {
    //                 const books = screen.getAllByTestId('IndividualBookCard')
    //                 expect(books).toHaveLength(16)
    //             })
    //         })

    //     })
    // })

    describe('Members tab shows correct contents', () => {

        // describe('contains correct components', () => {
        //     test('shows owner title', async () => {
        //         act(() => {
        //             renderClubProfile(role);
        //         })

        //         await waitFor(() => {
        //             const feedTab = screen.getByRole('tab', { name: /members/i })
        //             fireEvent.click(feedTab)
        //         })

        //         const title = screen.getByText(/owner/i)
        //         expect(title).toBeInTheDocument()
        //     })

        //     test('shows admins title', async () => {
        //         act(() => {
        //             renderClubProfile(role);
        //         })

        //         await waitFor(() => {
        //             const feedTab = screen.getByRole('tab', { name: /members/i })
        //             fireEvent.click(feedTab)
        //         })

        //         const title = screen.getByText(/admins/i)
        //         expect(title).toBeInTheDocument()
        //     })

        //     test('shows members title', async () => {
        //         act(() => {
        //             renderClubProfile(role);
        //         })

        //         await waitFor(() => {
        //             const feedTab = screen.getByRole('tab', { name: /members/i })
        //             fireEvent.click(feedTab)
        //         })

        //         const title = screen.getByTestId('membersTitle')
        //         expect(title).toBeInTheDocument()
        //     })

        //     test('shows applicants title', async () => {
        //         act(() => {
        //             renderClubProfile(role);
        //         })

        //         await waitFor(() => {
        //             const feedTab = screen.getByRole('tab', { name: /members/i })
        //             fireEvent.click(feedTab)
        //         })

        //         const title = screen.getByText(/applicants/i)
        //         expect(title).toBeInTheDocument()
        //     })

        //     test('shows banned users title', async () => {
        //         act(() => {
        //             renderClubProfile(role);
        //         })

        //         await waitFor(() => {
        //             const feedTab = screen.getByRole('tab', { name: /members/i })
        //             fireEvent.click(feedTab)
        //         })

        //         const title = screen.getByText(/banned users/i)
        //         expect(title).toBeInTheDocument()
        //     })

        //     test('displays correct number of people', async () => {
        //         act(() => {
        //             renderClubProfile(role);
        //         })

        //         await waitFor(() => {
        //             const feedTab = screen.getByRole('tab', { name: /members/i })
        //             fireEvent.click(feedTab)
        //         })

        //         const people = screen.queryAllByTestId('individualMemberCard')
        //         expect(people).toHaveLength(9)
        //     })
        // })

        // describe('displays first person correctly', () => {

        //     test('displays name', async () => {
        //         act(() => {
        //             renderClubProfile(role);
        //         })

        //         await waitFor(() => {
        //             const feedTab = screen.getByRole('tab', { name: /members/i })
        //             fireEvent.click(feedTab)
        //         })

        //         const name = screen.getByRole('link', { name: /pearcedamian/i });
        //         expect(name).toBeInTheDocument()
        //     })

        //     test('displays email', async () => {
        //         act(() => {
        //             renderClubProfile(role);
        //         })

        //         await waitFor(() => {
        //             const feedTab = screen.getByRole('tab', { name: /members/i })
        //             fireEvent.click(feedTab)
        //         })

        //         const email = screen.getByText(/stephenwatson@example\.org/i)
        //         expect(email).toBeInTheDocument()
        //     })

        //     test('displays bio with max. 45 characters', async () => {
        //         act(() => {
        //             renderClubProfile(role);
        //         })

        //         await waitFor(() => {
        //             const feedTab = screen.getByRole('tab', { name: /members/i })
        //             fireEvent.click(feedTab)
        //         })

        //         const bio = screen.getByText(/temporibus in dolore suscipit cupiditate moll\.\.\./i)
        //         expect(bio).toBeInTheDocument()
        //     })
        // });

        describe('manage members functionality', () => {

            //     // test('ban member moves member into banned members list', async () => {
            //     //     act(() => {
            //     //         renderClubProfile(role);
            //     //     })

            //     //     await waitFor(() => {
            //     //         const feedTab = screen.getByRole('tab', { name: /members/i })
            //     //         fireEvent.click(feedTab)
            //     //     })

            //     //     const membersBefore = screen.queryAllByTestId('memberMemberCard')
            //     //     const bannedBefore = screen.queryAllByTestId('bannedMemberCard')

            //     //     await waitFor(() => {
            //     //         const banButtons = screen.queryAllByRole('button', { name: "Ban" })
            //     //         fireEvent.click(banButtons[0])
            //     //     })

            //     //     // const banButtons = await screen.findAllByRole('button', { name: /ban/i })

            //     //     // act(() => { fireEvent.click(banButtons[0]) })

            //     //     await waitFor(() => {
            //     //         const membersAfter = screen.queryAllByTestId('memberMemberCard')
            //     //         // const bannedAfter = await screen.findAllByTestId('bannedMemberCard')

            //     //         expect(membersBefore.length).toBe(membersAfter.length + 1)
            //     //     })
            //     //     // expect(bannedBefore.length).toBe(bannedAfter.length - 1)
            //     // })

            //     test('contains the same number of ban buttons as members', async () => {
            //         act(() => {
            //             renderClubProfile(role);
            //         })

            //         await waitFor(() => {
            //             const feedTab = screen.getByRole('tab', { name: /members/i })
            //             fireEvent.click(feedTab)
            //         })

            //         const members = screen.queryAllByTestId('memberMemberCard')
            //         const banButtons = screen.queryAllByRole('button', { name: "Ban" })

            //         expect(members.length).toBe(banButtons.length)
            //     })

            //     test('contains the same number of accept buttons as applicants', async () => {
            //         act(() => {
            //             renderClubProfile(role);
            //         })

            //         await waitFor(() => {
            //             const feedTab = screen.getByRole('tab', { name: /members/i })
            //             fireEvent.click(feedTab)
            //         })

            //         const applicants = screen.queryAllByTestId('applicantMemberCard')
            //         const banButtons = screen.queryAllByRole('button', { name: /accept/i })

            //         expect(applicants.length).toBe(banButtons.length)
            //     })

            //     test('contains the same number of reject buttons as applicants', async () => {
            //         act(() => {
            //             renderClubProfile(role);
            //         })

            //         await waitFor(() => {
            //             const feedTab = screen.getByRole('tab', { name: /members/i })
            //             fireEvent.click(feedTab)
            //         })

            //         const applicants = screen.queryAllByTestId('applicantMemberCard')
            //         const banButtons = screen.queryAllByRole('button', { name: /reject/i })

            //         expect(applicants.length).toBe(banButtons.length)
            //     })

            //     test('contains the same number of unban buttons as banned users', async () => {
            //         act(() => {
            //             renderClubProfile(role);
            //         })

            //         await waitFor(() => {
            //             const feedTab = screen.getByRole('tab', { name: /members/i })
            //             fireEvent.click(feedTab)
            //         })

            //         const bannedUsers = screen.queryAllByTestId('bannedMemberCard')
            //         const banButtons = screen.queryAllByRole('button', { name: /unban/i })

            //         expect(bannedUsers.length).toBe(banButtons.length)
            //     })

            // for owner: contains additional ban buttons for admins
            // });


            describe('does not show owner control', () => {
                test('contains no make owner buttons', async () => {
                    act(() => {
                        renderClubProfile(role);
                    })

                    await waitFor(() => {
                        const feedTab = screen.getByRole('tab', { name: /members/i })
                        fireEvent.click(feedTab)
                    })

                    const admins = screen.queryAllByTestId('adminMemberCard')
                    const makeOwnerButtons = screen.queryAllByRole('button', { name: /make owner/i })

                    expect(admins.length).not.toBe(0) // ensure that there are admins
                    expect(makeOwnerButtons.length).toBe(0)
                })

                test('contains no demote buttons', async () => {
                    act(() => {
                        renderClubProfile(role);
                    })

                    await waitFor(() => {
                        const feedTab = screen.getByRole('tab', { name: /members/i })
                        fireEvent.click(feedTab)
                    })

                    const admins = screen.queryAllByTestId('adminMemberCard')
                    const makeOwnerButtons = screen.queryAllByRole('button', { name: /demote/i })

                    expect(admins.length).not.toBe(0) // ensure that there are admins
                    expect(makeOwnerButtons.length).toBe(0)
                })

                test('contains no promote buttons', async () => {
                    act(() => {
                        renderClubProfile(role);
                    })

                    await waitFor(() => {
                        const feedTab = screen.getByRole('tab', { name: /members/i })
                        fireEvent.click(feedTab)
                    })

                    const members = screen.queryAllByTestId('memberMemberCard')
                    const promoteButtons = screen.queryAllByRole('button', { name: /promote/i })

                    expect(members.length).not.toBe(0) // ensure that there are admins
                    expect(promoteButtons.length).toBe(0)
                })
            })
        })
    })
})