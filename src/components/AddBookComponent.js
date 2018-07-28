import {Component} from 'react';

import '../assets/css/ManualAdd.css';
import CategoryService from '../services/category_service';
import BookService from '../services/book_service';

import {convISBN10toISBN13, convISBN13toISBN10} from "../utils/IsbnUtils";
import {DEFAULT_BOOK_COVER_URL, NUMBERS_REGEX, WRITING_ISBN_10_REGEX, WRITING_ISBN_13_REGEX} from "../constants";
import {checkImage} from "../utils/ImageUtils";

class AddBookComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            categories: [],
            selectedCategory: null,
            title: '',
            isbn10: '',
            isbn13: '',
            issn: '',
            callNumber: '',
            publisher: '',
            publisher: '',
            year: '',
            copies: 1,
            bookCoverUrl: DEFAULT_BOOK_COVER_URL,
            buttonIsEnabled: false,
            authors: [],
        };
        this.loadCategories();
    }

    loadCategories() {
        CategoryService.getCategories()
            .then((responseCategories => {
                let newState = Object.assign({}, this.state);
                newState.categories = responseCategories;
                this.setState(newState);
            }))
    }

    checkButtonState(newState) {
        if (newState.title.trim().length > 0) {
            newState.buttonIsEnabled = true;
        } else {
            newState.buttonIsEnabled = false;
        }
    }

    onCategorySelect(category) {
        let newState = Object.assign({}, this.state);
        newState.selectedCategory = category;
        this.checkButtonState(newState);
        this.setState(newState);
    }

    handleTitleChange(titleInput) {
        let newState = Object.assign({}, this.state);
        newState.title = titleInput.target.value;
        this.checkButtonState(newState);
        this.setState(newState);
    }

    handleIsbn10Change(isbn10Input) {
        if (isbn10Input.target.value === '' || WRITING_ISBN_10_REGEX.test(isbn10Input.target.value)) {
            let newState = Object.assign({}, this.state);
            newState.isbn10 = isbn10Input.target.value.substr(0,10);
            if(newState.isbn10.length === 10) {
                newState.isbn13 = convISBN10toISBN13(newState.isbn10);
            } else {
                newState.isbn13 = '';
            }
            this.setState(newState);
        }
    }

    handleIsbn13Change(isbn13Input) {
        if (isbn13Input.target.value === '' || WRITING_ISBN_13_REGEX.test(isbn13Input.target.value)) {
            let newState = Object.assign({}, this.state);
            newState.isbn13 = isbn13Input.target.value.substr(0,13);
            if(newState.isbn13.length === 13) {
                newState.isbn10 = convISBN13toISBN10(newState.isbn13);
            } else {
                newState.isbn10 = '';
            }
            this.setState(newState);
        }
    }

    handleIssnChange(issnInput) {
        let newState = Object.assign({}, this.state);
        newState.issn = issnInput.target.value;
        this.setState(newState);
    }

    handleCallNumberChange(callNumberInput) {
        let newState = Object.assign({}, this.state);
        newState.callNumber = callNumberInput.target.value;
        this.setState(newState);
    }

    handlePublisherChange(publisherInput) {
        let newState = Object.assign({}, this.state);
        newState.publisher = publisherInput.target.value;
        this.setState(newState);
    }

    handleEditionChange(editionInput) {
        let newState = Object.assign({}, this.state);
        newState.edition = editionInput.target.value;
        this.setState(newState);
    }

    handleYearChange(yearInput) {
        if (yearInput.target.value === '' || NUMBERS_REGEX.test(yearInput.target.value)) {
            let newState = Object.assign({}, this.state);
            newState.year = yearInput.target.value;
            this.setState(newState);
        }
    }

    handleCopiesChange(copiesInput) {
        if (copiesInput.target.value === '' || NUMBERS_REGEX.test(copiesInput.target.value)) {
            let newState = Object.assign({}, this.state);
            newState.copies = copiesInput.target.value;
            this.setState(newState);
        }
    }

    handleBookCoverUrlChange(urlInput) {
        let providedUrl = urlInput.target.value;
        checkImage(urlInput.target.value,
            () => {
                let newState = Object.assign({}, this.state);
                newState.bookCoverUrl = providedUrl;
                this.setState(newState);
            },
            () => {
                let newState = Object.assign({}, this.state);
                newState.bookCoverUrl = DEFAULT_BOOK_COVER_URL;
                this.setState(newState);
            })
    }

    handleAuthorsChange(selected) {
        let newState = Object.assign({}, this.state);
        newState.authors = selected;
        this.setState(newState);
    }

    handleSubmit(form) {
        form.preventDefault(); // stops the page from reloading
        let authorNames = [];
        for (let author of this.state.authors) {
            authorNames.push(author.label);
        }
        BookService.addBook(authorNames)
            .then(() => alert("Success"));
    }

}

export default AddBookComponent;