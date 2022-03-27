import { render, screen, fireEvent } from '@testing-library/react';
import RecommenderPage from '../RecommenderPage';

describe("Components exist", () => {
    test("contains filter button for my genre recommendations", async () => {
        render(<RecommenderPage />)
        // need to mock axios request to get genres.
        const filter_button = 
    })
})
// <FilterButton onClick={returnFictionRecommendations}>My {value} Recommendations</FilterButton><br/>
//                     <FilterButton onClick={returnTop10Recommendations}>My Recommendations</FilterButton><br/>
//                     <FilterButton onClick={returnGlobalTop10Recommendations}>Global Top 10</FilterButton><br/>
//                     <FilterButton onClick={returnGlobalTop10FictionRecommendations}>Global {value} Top 10</FilterButton><br/>