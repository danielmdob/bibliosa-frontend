import {BASE_URL} from '../constants';
import axios from 'axios';

class _AuthenticateService {
    loggedInUrl = BASE_URL + 'is_logged_in';
    isAdministratorUrl = BASE_URL + 'is_administrator';

    isLoggedIn() {
        return axios.get(this.loggedInUrl,
            { 'headers': { 'Content-Type': 'application/x-www-form-urlencoded' }, withCredentials: true });
    }

    isAdministrator() {
        return axios.get(this.isAdministratorUrl,
            { 'headers': { 'Content-Type': 'application/x-www-form-urlencoded' }, withCredentials: true })
            .then(response => response.data);
    }

    logout() {
        window.location.replace(BASE_URL + 'logout');
    }
}

const AuthenticateService = new _AuthenticateService();
export default AuthenticateService;