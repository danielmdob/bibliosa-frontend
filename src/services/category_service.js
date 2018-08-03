import {BASE_URL} from '../constants';
import axios from 'axios';

class _CategoryService {
    getCategoriesUrl = BASE_URL + 'get_categories';
    createCategoryUrl = BASE_URL + 'create_category';
    deleteCategoryUrl = BASE_URL + 'delete_category';
    editCategoryUrl = BASE_URL + 'edit_category';

    getCategories() {
        return axios.get(this.getCategoriesUrl,
            { 'headers': { 'Content-Type': 'application/x-www-form-urlencoded' }})
            .then(response => response.data);
    }

    createCategory(name) {
        const data = `name=${name}`;
        return axios.post(this.createCategoryUrl,
            data,
            { 'headers': { 'Content-Type': 'application/x-www-form-urlencoded' }, withCredentials: true })
            .then(response => response.data);
    }

    deleteCategory(categoryId) {
        const data = `id=${categoryId}`;
        return axios.post(this.deleteCategoryUrl,
            data,
            { 'headers': { 'Content-Type': 'application/x-www-form-urlencoded' }, withCredentials: true })
            .then(response => response.data);
    }

    editCategory(categoryId, newName) {
        const data = `id=${categoryId}&name=${newName}`;
        return axios.post(this.editCategoryUrl,
            data,
            { 'headers': { 'Content-Type': 'application/x-www-form-urlencoded' }, withCredentials: true })
            .then(response => response.data);
    }
}

const CategoryService = new _CategoryService();
export default CategoryService;