import currentUser from '../mocksData/getCurrentUser.json'
import myTop10Recommendations from '../mocksData/getMyTop10Recommendations.json'
import tenGenres from '../mocksData/getTenGenres.json'
import top10GlobalRecommendations from '../mocksData/getTop10GlobalRecommendations.json'
import top10GlobalHistoryRecommendations from '../mocksData/getTop10GlobalHistoryRecommendations.json'
import myTop10HistoryRecommendations from '../mocksData/getMyTop10HistoryRecommendations.json'


const generateGetResponse = (url) => {
    switch (url) {
        case "genres?n=10":
            return { data: tenGenres };
        case "get_current_user":
            return { data: currentUser };
        case "recommender/0/10/1/top_n/":
            return { data: myTop10Recommendations }
        case "recommender/0/10/top_n_global/":
            return { data: top10GlobalRecommendations }
        case "recommender/0/10/top_n_global_for_genre/history/":
            return { data: top10GlobalHistoryRecommendations }
        case "recommender/0/10/1/top_n_for_genre/history/":
            return { data: myTop10HistoryRecommendations }
        default:
            console.log("no matching mock for url ", url)
            return { data: {} };
    }
}

export default {
    defaults: {
        headers: {
            common: {
                "Content-Type": "",
                "Authorization": ""
            }
        }
    },
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
    create: jest.fn(function () {
        return {
            interceptors: {
                request: {
                    use: jest.fn(() => Promise.resolve({ data: {} })),
                },
                response: {
                    use: jest.fn(() => Promise.resolve({ data: {} })),
                }
            },
            defaults: {
                headers: {
                    common: {
                        "Content-Type": "",
                        "Authorization": ""
                    }
                }
            },
            get: jest.fn((url) => Promise.resolve(generateGetResponse(url))),
            post: jest.fn(() => Promise.resolve({ data: {} })),
            put: jest.fn(() => Promise.resolve({ data: {} })),
            delete: jest.fn(() => Promise.resolve({ data: {} })),
        }
    }),
};