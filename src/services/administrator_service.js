import {BASE_URL} from '../constants';
import axios from 'axios';

class _AdministratorService {
    inviteAdminUrl = BASE_URL + 'invite_administrator';

    inviteAdministrator(inviteeEmail) {
        const data = `invitee_email=${inviteeEmail}`;
        return axios.post(this.inviteAdminUrl,
            data,
            { 'headers': { 'Content-Type': 'application/x-www-form-urlencoded' }, withCredentials: true })
            .then(response => response.data);
    }
}

const AdministratorService = new _AdministratorService();
export default AdministratorService;