import React from 'react';
import AddBookForm from './AddBookForm';
import SetBook from './SetBook';

import BookService from '../services/book_service';

import '../assets/css/ManualAdd.css';
import {DEFAULT_BOOK_COVER_URL} from "../constants";
import {Alert, Button, Row} from "react-bootstrap";
import {Link, Redirect} from "react-router-dom";
import {checkImage} from "../utils/ImageUtils";

class EditBook extends SetBook {

    constructor(props) {
        super(props);

        this.loadBookInfo();
    }

    getAuthorsNames(authors) {
        let authorNames = [];
        for (let author of authors) {
            authorNames.push(author.full_name);
        }
        return authorNames;
    }

    loadBookInfo() {
        let bookId = this.props.match.params.bookId;
        BookService.getBookInfo(bookId)
            .then(response => {
                let newState = Object.assign({}, this.state);
                newState.title = response.title;
                response.isbn10 !== null ? newState.isbn10 = response.isbn10 : newState.isbn10 = '';
                response.isbn13 !== null ? newState.isbn13 = response.isbn13 : newState.isbn13 = '';
                response.issn !== null ? newState.issn = response.issn : newState.issn = '';
                response.call_number !== null ? newState.callNumber = response.call_number : newState.callNumber = '';
                response.publisher !== null ? newState.publisher = response.publisher : newState.publisher = '';
                response.edition !== null ? newState.edition = response.edition : newState.edition = '';
                response.year !== null ? newState.year = response.year : newState.year = '';
                newState.selectedCategory = response.category;
                newState.copies = response.copies;
                newState.authors = this.getAuthorsNames(response.authors);
                response.cover !== null ? newState.bookCoverUrl = response.cover : newState.bookCoverUrl = DEFAULT_BOOK_COVER_URL;
                this.setState(newState);
            })
            .then(() =>{
                checkImage(this.state.bookCoverUrl, null, () => {
                    let newState = Object.assign({}, this.state);
                    newState.bookCoverUrl = DEFAULT_BOOK_COVER_URL;
                    this.setState(newState);
                });
            })
    }

    handleSubmit(form) {
        let bookId = this.props.match.params.bookId;
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

        BookService.editBook(bookId, categoryId, this.state.title, authorNames, this.state.isbn10,
            this.state.isbn13, this.state.issn, this.state.callNumber, this.state.publisher, this.state.edition,
            this.state.year, this.state.copies, this.state.bookCoverUrl)
            .then(() => {
                newState.addStatus = this.success;
                this.setState(newState);
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

    renderStatusAlert() {
        let conflictingCode;

        switch (this.state.addStatus) {
            case this.success:
                return (<Redirect to={"/books/" +  this.props.match.params.bookId} />);

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

    renderAddBookForm() {
        let newState = Object.assign({}, this.state);
        return (
            <AddBookForm parentState={newState} handleTitleChange={(titleInput) =>this.handleTitleChange(titleInput)}
                         handleIssnChange={(issnInput) =>this.handleIssnChange(issnInput)}
                         handleCallNumberChange={(callNumberInput) =>this.handleCallNumberChange(callNumberInput)}
                         handlePublisherChange={(publisherInput) =>this.handlePublisherChange(publisherInput)}
                         handleYearChange={(yearInput) => this.handleYearChange(yearInput)}
                         handleCopiesChange={(copiesInput) => this.handleCopiesChange(copiesInput)}
                         handleIsbn10Change={(isbn10Input) => this.handleIsbn10Change(isbn10Input)}
                         handleIsbn13Change={(isbn13Input) => this.handleIsbn13Change(isbn13Input)}
                         handleEditionChange={(editionInput) => this.handleEditionChange(editionInput)}
                         handleBookCoverUrlChange={(urlInput) => this.handleBookCoverUrlChange(urlInput)}
                         handleAuthorsChange={(selected) => this.handleAuthorsChange(selected)}
                         handleSubmit={(form) => this.handleSubmit(form)}
                         renderStatusAlert={() => this.renderStatusAlert()}
                         onCategorySelect={(category) => this.onCategorySelect(category)}
                         title="Editar libro"
            />
        );
    }

    render() {
        return (
            this.renderAddBookForm()
        );
    }
}

export default EditBook;