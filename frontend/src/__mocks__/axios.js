import get_current_user from '../mocksData/get_current_user.json'
import myTop10Recommendations from '../mocksData/myTop10Recommendations.json'
import tenGenres from '../mocksData/tenGenres.json'

const generateGetResponse = (url) => {
    switch (url) {
        case "genres?n=10":
            return { data: tenGenres };
        case "get_current_user":
            return { data: get_current_user };
        case "recommender/0/10/1/top_n/":
            return { data: myTop10Recommendations }
        default:
            console.log("no matching mock for this url")
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