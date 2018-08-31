import {BASE_URL} from '../constants';
import axios from 'axios';

class _UserService {
    getUserInfoUrl = BASE_URL + 'get_user_info';
    getUserInfoIdUrl = BASE_URL + 'get_user_info_id';
    subscribeUserURl = BASE_URL + 'subscribe_user';
    firstNameSearchUrl = BASE_URL + 'user_search_first_name';
    lastNameSearchUrl = BASE_URL + 'user_search_last_name';
    cardNumberSearchUrl = BASE_URL + 'user_search_card_number';
    editOtherUserUrl = BASE_URL + 'edit_other_user';

    getUserInformation() {
        return axios.get(this.getUserInfoUrl,
            { 'headers': { 'Content-Type': 'application/x-www-form-urlencoded' }, withCredentials: true })
            .then(response => response.data);
    }

    getUserInformationById(userId) {
        return axios.get(this.getUserInfoIdUrl,
            {
                'headers': { 'Content-Type': 'application/x-www-form-urlencoded' }, withCredentials: true,
                params: {
                    id: userId,
                }
            })
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

    lastNameSearch(searchString) {
        return axios.get(this.lastNameSearchUrl,
            {
                'headers': { 'Content-Type': 'application/x-www-form-urlencoded' }, withCredentials: true,
                params: {
                    search_string: searchString,
                }
            })
            .then(response => response.data);
    }

    cardNumberSearch(searchString) {
        return axios.get(this.cardNumberSearchUrl,
            {
                'headers': { 'Content-Type': 'application/x-www-form-urlencoded' }, withCredentials: true,
                params: {
                    search_string: searchString,
                }
            })
            .then(response => response.data);
    }

    editOtherUser(userId, firstName, lastName, cardNumber) {
        const data = `id=${userId}&first_name=${firstName}&last_name=${lastName}&card_number=${cardNumber}`;
        return axios.post(this.editOtherUserUrl,
            data,
            { 'headers': { 'Content-Type': 'application/x-www-form-urlencoded' }, withCredentials: true })
            .then(response => response.data);
    }
}

const UserService = new _UserService();
export default UserService;