import React, {Component} from 'react';

import '../assets/css/ManualAdd.css';
import CategoryService from '../services/category_service';
import BookService from '../services/book_service';

import {convISBN10toISBN13, convISBN13toISBN10} from "../utils/IsbnUtils";
import {DEFAULT_BOOK_COVER_URL, NUMBERS_REGEX, WRITING_ISBN_10_REGEX, WRITING_ISBN_13_REGEX} from "../constants";
import {checkImage} from "../utils/ImageUtils";
import {Alert, Button, Row} from "react-bootstrap";

import {Link, Redirect} from 'react-router-dom'

class SetBookComponent extends Component {
    success = 'SUCCESS';
    isbn10Error = 'ISBN10_ERROR';
    isbn13Error = 'ISBN13_ERROR';
    callNumberError = 'CALL_NUMBER_ERROR';

    constructor(props) {
        super(props);

        this.initState();
        this.loadCategories();
    }

    initState() {
        this.state = {
            categories: [],
            selectedCategory: null,
            title: '',
            isbn10: '',
            isbn13: '',
            issn: '',
            callNumber: '',
            edition: '',
            publisher: '',
            year: '',
            copies: 1,
            bookCoverUrl: DEFAULT_BOOK_COVER_URL,
            authors: [],
            addStatus: '',
            conflictingBook: null,
        };
    }

    loadCategories() {
        CategoryService.getCategories()
            .then((responseCategories => {
                let newState = Object.assign({}, this.state);
                newState.categories = responseCategories;
                this.setState(newState);
            }))
    }

    onCategorySelect(category) {
        let newState = Object.assign({}, this.state);
        newState.selectedCategory = category;
        this.setState(newState);
    }

    handleTitleChange(titleInput) {
        let newState = Object.assign({}, this.state);
        newState.title = titleInput.target.value;
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
            if (author.label == null) {
                authorNames.push(author);
            } else {
                authorNames.push(author.label);
            }
        }

        let newState = Object.assign({}, this.state);

        let categoryId;
        this.state.selectedCategory != null ? categoryId = this.state.selectedCategory.id : categoryId = null;

        BookService.addBook(categoryId, this.state.title, authorNames, this.state.isbn10,
            this.state.isbn13, this.state.issn, this.state.callNumber, this.state.publisher, this.state.edition,
            this.state.year, this.state.copies, this.state.bookCoverUrl)
            .then(() => {
                newState.addStatus = this.success;
            })
            .catch((error) => {
                switch (error.response.data.conflicting_field) {
                    case "isbn10":
                        newState.addStatus = this.isbn10Error;
                        break;

                    case "isbn13":
                        newState.addStatus = this.isbn13Error;
                        break;

                    case "call_number":
                        newState.addStatus = this.callNumberError;
                        break;

                    default:
                }
                newState.conflictingBook = error.response.data;
            })
            .then(() => this.setState(newState));
    }

    handleDismiss() {
        let newState = Object.assign({}, this.state);
        newState.addStatus = '';
        this.setState(newState);
    }

    renderStatusAlert() {
        let conflictingCode;

        switch (this.state.addStatus) {
            case this.success:
                return (<Redirect to="/books" />);

            case this.isbn10Error:
                conflictingCode = 'ISBN';
                break;

            case this.isbn13Error:
                conflictingCode = 'ISBN13';
                break;

            case this.callNumberError:
                conflictingCode = "de categorización";
                break;

            default:
        }

        if (this.state.addStatus !== '') {
            return (
                <Row>
                    <Alert bsStyle='warning'>
                        El código {conflictingCode} ingresado ya corresponde al libro <Link to={'/books/'+this.state.conflictingBook.id}>{this.state.conflictingBook.title}</Link>
                        <p><Button onClick={() => this.handleDismiss()}>Ok</Button></p>
                    </Alert>
                </Row>

            );
        }
    }

}

export default SetBookComponent;