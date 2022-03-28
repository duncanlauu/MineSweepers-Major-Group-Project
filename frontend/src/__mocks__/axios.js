const generateResponse = (url) => {
    switch (url) {
        case "genres?n=10":
            return { data: ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"] };
        case "get_current_user":
            return {
                data: {
                    "id": 1,
                    "password": "pbkdf2_sha256$260000$nghK9JWg2c7lKU5YE8ggTX$YTSrsurQe57gmH6582vjRdgHlHYLd2iUKBqnbedXPbw=",
                    "last_login": null,
                    "is_superuser": false,
                    "is_staff": false,
                    "is_active": true,
                    "date_joined": "2022-03-24T13:36:10.145043Z",
                    "username": "test",
                    "email": "test@test.org",
                    "first_name": "asdf",
                    "last_name": "asdf",
                    "bio": "asdf",
                    "location": "asdf",
                    "birthday": "2022-03-02",
                    "created_at": "2022-03-24T13:36:10.250617Z",
                    "groups": [],
                    "user_permissions": [],
                    "liked_books": [],
                    "read_books": [],
                    "clubs": [],
                    "friends": []
                }
            };
        default:
            console.log("no matchting mock for this url")
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
            get: jest.fn((url) => Promise.resolve(generateResponse(url))),
            post: jest.fn(() => Promise.resolve({ data: {} })),
            put: jest.fn(() => Promise.resolve({ data: {} })),
            delete: jest.fn(() => Promise.resolve({ data: {} })),
        }
    }),
};