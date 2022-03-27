export default {
    get: jest.fn().mockImplementation((url) => {
        switch (url) {
            case "http://127.0.0.1:8000/api/book_profile/0195153448":
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
            default:
                throw new Error(`UNMATCHED URL: ${url}`);
        }
    }),
};