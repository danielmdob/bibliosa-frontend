import {BASE_URL} from '../constants';
import axios from 'axios';

class _UserService {
    getUserInfoUrl = BASE_URL + 'get_user_info';

    getUserInformation() {
        return axios.get(this.getUserInfoUrl,
            { 'headers': { 'Content-Type': 'application/x-www-form-urlencoded' }, withCredentials: true })
            .then(response => response.data);
    }
}

const UserService = new _UserService();
export default UserService;