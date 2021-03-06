import {BASE_URL} from '../constants';
import axios from 'axios';

class _LoanService {
    makeLoanUrl = BASE_URL + 'make_loan';
    getBookLoansUrl = BASE_URL + 'get_book_loans';
    getActiveLoansUrl = BASE_URL + 'get_active_loans';
    returnBookUrl = BASE_URL + 'return_book';

    makeLoan(readerId, bookId, returnDate) {
        const data = `reader_id=${readerId}&book_id=${bookId}&return_date=${returnDate}`;
        return axios.post(this.makeLoanUrl,
            data,
            { 'headers': { 'Content-Type': 'application/x-www-form-urlencoded' }, withCredentials: true })
            .then(response => response.data);
    }

    getBookLoans(bookId) {
        return axios.get(this.getBookLoansUrl,
            {
                'headers': { 'Content-Type': 'application/x-www-form-urlencoded' }, withCredentials: true,
                params: {
                    book_id: bookId,
                }
            })
            .then(response => response.data);
    }

    getActiveLoans() {
        return axios.get(this.getActiveLoansUrl,
            {
                'headers': { 'Content-Type': 'application/x-www-form-urlencoded' }, withCredentials: true
            })
            .then(response => response.data);
    }

    returnBook(loanId) {
        const data = `id=${loanId}`;
        return axios.post(this.returnBookUrl,
            data,
            { 'headers': { 'Content-Type': 'application/x-www-form-urlencoded' }, withCredentials: true })
            .then(response => response.data);
    }
}

const LoanService = new _LoanService();
export default LoanService;