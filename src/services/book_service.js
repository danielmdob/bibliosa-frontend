import {BASE_URL} from '../constants';
import axios from 'axios';

class _BookService {
    addBookUrl = BASE_URL + 'add_book';
    editBookUrl = BASE_URL + 'edit_book';
    deleteBookUrl = BASE_URL + 'delete_book';
    getBookInfoUrl = BASE_URL + 'get_book';
    titleSearchUrl = BASE_URL + 'title_search_book';
    newArrivalsUrl = BASE_URL + 'new_arrivals';

    addBook(categoryId, title, authors, isbn10, isbn13, issn, callNumber, publisher, edition, year, copies, bookCoverUrl) {
        bookCoverUrl = encodeURIComponent(bookCoverUrl);
        const data = `category_id=${categoryId}&title=${title}&authors=${authors}&isbn10=${isbn10}&isbn13=${isbn13}&issn=${issn}&publisher=${publisher}&edition=${edition}&year=${year}&copies=${copies}&book_cover_url=${bookCoverUrl}&call_number=${callNumber}`;
        return axios.post(this.addBookUrl,
            data,
            { 'headers': { 'Content-Type': 'application/x-www-form-urlencoded' }, withCredentials: true })
            .then(response => response.data);
    }

    editBook(bookId, categoryId, title, authors, isbn10, isbn13, issn, callNumber, publisher, edition, year, copies, bookCoverUrl) {
        bookCoverUrl = encodeURIComponent(bookCoverUrl)
        const data = `id=${bookId}&category_id=${categoryId}&title=${title}&authors=${authors}&isbn10=${isbn10}&isbn13=${isbn13}&issn=${issn}&publisher=${publisher}&edition=${edition}&year=${year}&copies=${copies}&book_cover_url=${bookCoverUrl}&call_number=${callNumber}`;
        return axios.post(this.editBookUrl,
            data,
            { 'headers': { 'Content-Type': 'application/x-www-form-urlencoded' }, withCredentials: true })
            .then(response => response.data);
    }

    getBookInfo(bookId) {
        return axios.get(this.getBookInfoUrl,
            {
                params: {
                    id: bookId,
                }
            })
            .then(response => response.data);
    }

    titleSearch(searchString) {
        return axios.get(this.titleSearchUrl,
            {
                params: {
                    search_string: searchString,
                }
            })
            .then(response => response.data);
    }

    getNewArrivals() {
        return axios.get(this.newArrivalsUrl)
            .then(reponse => reponse.data);
    }

    deleteBook(bookId) {
        const data = `id=${bookId}`;
        return axios.post(this.deleteBookUrl,
            data,
            { 'headers': { 'Content-Type': 'application/x-www-form-urlencoded' }, withCredentials: true })
            .then(response => response.data);
    }
}

const BookService = new _BookService();
export default BookService;