import {BASE_URL} from '../constants';
import axios from 'axios';

class _AuthorService {
    getAuthorUrl = BASE_URL + 'get_author';
    authorSearchUrl = BASE_URL + 'author_search';

    getAuthorInfo(authorId) {
        return axios.get(this.getAuthorUrl,
            {
                params: {
                    id: authorId,
                }
            })
            .then(response => response.data);
    }

    search(searchString) {
        return axios.get(this.authorSearchUrl,
            {
                params: {
                    search_string: searchString,
                }
            })
            .then(response => response.data);
    }
}

const AuthorService = new _AuthorService();
export default AuthorService;