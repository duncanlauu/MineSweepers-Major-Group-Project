import React from 'react'
import { render } from '@testing-library/react';
// import '@testing-library/jest-dom'
import ClubProfile from '../ClubProfile';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// render the club profile with memory router and initial entries as wrapper

const renderClubProfile = (role) => {
    let club_id;

    switch (role) {
        case 'not_applied':
            club_id = '3'
            break
        case 'applied':
            club_id = '4'
            break
        case 'member':
            club_id = '2'
            break
        case 'admin':
            club_id = '15'
            break
        case 'owner':
            club_id = '1'
            break
        case 'banned':
            club_id = '10'
    }

    return render(
        <MemoryRouter initialEntries={[`/club_profile/${club_id}`]}>
            <Routes>
                <Route path='club_profile/:club_id' element={<ClubProfile />} />
            </Routes>
        </MemoryRouter>)
}

export default renderClubProfile