import {BASE_URL} from '../constants';
import axios from 'axios';

class _BookService {
    addBookUrl = BASE_URL + 'add_book';

    addBook(authors) {
        let data = new FormData();
        data.append('authors', authors);
        return axios.post(this.addBookUrl,
            data,
            { 'headers': { 'Content-Type': 'application/x-www-form-urlencoded' }, withCredentials: true })
            .then(response => response.data);
    }
}

const BookService = new _BookService();
export default BookService;