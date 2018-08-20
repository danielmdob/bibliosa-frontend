import {BASE_URL} from '../constants';
import axios from 'axios';

class _UserService {
    getUserInfoUrl = BASE_URL + 'get_user_info';
    subscribeUserURl = BASE_URL + 'subscribe_user';
    firstNameSearchUrl = BASE_URL + 'user_search_first_name';

    getUserInformation() {
        return axios.get(this.getUserInfoUrl,
            { 'headers': { 'Content-Type': 'application/x-www-form-urlencoded' }, withCredentials: true })
            .then(response => response.data);
    }

    subscribeUser(email, firstName, lastName, cardNumber) {
        const data = `email=${email}&first_name=${firstName}&last_name=${lastName}&card_number=${cardNumber}`;
        return axios.post(this.subscribeUserURl,
            data,
            { 'headers': { 'Content-Type': 'application/x-www-form-urlencoded' }, withCredentials: true })
            .then(response => response.data);
    }

    firstNameSearch(searchString) {
        return axios.get(this.firstNameSearchUrl,
            {
                'headers': { 'Content-Type': 'application/x-www-form-urlencoded' }, withCredentials: true,
                params: {
                    search_string: searchString,
                }
            })
            .then(response => response.data);
    }
}

const UserService = new _UserService();
export default UserService;