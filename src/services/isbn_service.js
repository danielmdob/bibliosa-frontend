import {ISBN_URL} from '../constants';
import axios from 'axios';

class _IsbnService {

    fillIsbns(book, bookInfo) {
        let industryIdentifiers = bookInfo.volumeInfo.industryIdentifiers;
        for (let industryIdentifier of industryIdentifiers) {
            if (industryIdentifier.type === 'ISBN_10') {
                book.isbn10 = industryIdentifier.identifier;
            } else if (industryIdentifier.type === 'ISBN_13') {
                book.isbn13 = industryIdentifier.identifier;
            }
        }
    }

    getBookInfo(isbn) {
        return axios.get(ISBN_URL + isbn)
            .then(firstResponse => {
                if(firstResponse.data.totalItems === 0 || firstResponse.data.length > 1) {
                    return null;
                }

                if (firstResponse.data.items == null) {
                    return null;
                }

                let firstItem = firstResponse.data.items[0];
                if (firstItem.selfLink == null) {
                    return null;
                }

                return axios.get(firstItem.selfLink)
                    .then((secondResponse => {
                        let bookInfo = secondResponse.data;

                        let book = {};
                        book.title = bookInfo.volumeInfo.title;
                        book.authors = bookInfo.volumeInfo.authors;
                        let year = bookInfo.volumeInfo.publishedDate.substr(0,4);
                        book.year = isNaN(year) ? null : year;
                        isNaN(book.year) ? book.year = null : book.year = book.year;
                        book.publisher = bookInfo.volumeInfo.publisher;
                        book.authors = bookInfo.volumeInfo.authors;
                        if (bookInfo.volumeInfo.imageLinks != null) {
                            book.bookCoverUrl = bookInfo.volumeInfo.imageLinks.thumbnail;
                        }
                        this.fillIsbns(book, bookInfo);
                        return book;
                    }));
            });
    }
}

const Isbn_service = new _IsbnService();
export default Isbn_service;