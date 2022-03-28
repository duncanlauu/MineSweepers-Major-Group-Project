export default {
    defaults: {
        headers: {
            common: {
                "Content-Type": "",
                "Authorization": ""
            }
        }
    },
    get: jest.fn(() => Promise.resolve({data: {}})),
    post: jest.fn(() => Promise.resolve({data: {}})),
    put: jest.fn(() => Promise.resolve({data: {}})),
    delete: jest.fn(() => Promise.resolve({data: {}})),
    create: jest.fn(function () {
        return {
            interceptors: {
                request: {
                    use: jest.fn(() => Promise.resolve({data: {}})),
                },
                response: {
                    use: jest.fn(() => Promise.resolve({data: {}})),
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
            get: jest.fn((url) => {
                switch (url) {
                    case "books/0195153448":
                        return Promise.resolve({
                            data: {
                                "id": "0195153448",
                                "title": "Classical Mythology",
                                "author": "Mark P. O. Morford",
                                "publication_date": "2002",
                                "publisher": "Oxford University Press",
                                "image_links_large": "http://images.amazon.com/images/P/0195153448.01.LZZZZZZZ.jpg",
                                "image_links_medium": "http://images.amazon.com/images/P/0195153448.01.MZZZZZZZ.jpg",
                                "image_links_small": "http://images.amazon.com/images/P/0195153448.01.THUMBZZZ.jpg",
                                "genre": "Social Science"
                            }
                        });
                    case "recommender/0/10/1/top_n_clubs_top_club_books":
                        return Promise.resolve({
                            data: {
                                "owner": {"email": "jebediah.kerman@example.com"},
                                "name": "Kerbal space club",
                                "id": 1
                            }
                        });
                    default:
                        throw new Error(`UNMATCHED URL: ${url}`);
                }
            }),
            post: jest.fn(() => Promise.resolve({data: {}})),
            put: jest.fn(() => Promise.resolve({data: {}})),
            delete: jest.fn(() => Promise.resolve({data: {}})),
        }
    }),
};