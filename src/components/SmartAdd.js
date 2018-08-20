import React from 'react'
import {Grid, Row, Button, FormGroup, ControlLabel, FormControl, HelpBlock, Alert, Col} from 'react-bootstrap';
import AddBookForm from './AddBookForm';
import SetBook from './SetBook';

import IsbnService from '../services/isbn_service';

import {DEFAULT_BOOK_COVER_URL} from "../constants";

import '../assets/css/BookInfo.css';
import '../assets/css/SmartAdd.css';

class SmartAdd extends SetBook {

    starting = 'STARTING';
    bookNotFound = 'NOT_FOUND';
    validIsbnSubmitted = 'SUBMITTED_VALID';

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
            enteredIsbn: '',
            book: null,
            smartAddStatus: this.starting,
        };
    }

    handleIsbnChange(input) {
        let newState = Object.assign({}, this.state);
        newState.enteredIsbn = input.target.value;
        this.setState(newState);
    }

    loadBook(book) {
        let newState = Object.assign({}, this.state);
        newState.title = book.title;
        newState.publisher = book.publisher;
        newState.year = book.year;
        newState.isbn10 = book.isbn10;
        newState.isbn13 = book.isbn13;
        newState.authors = book.authors;
        newState.bookCoverUrl = book.bookCoverUrl;
        newState.bookCoverUrl = (book.bookCoverUrl == null) ? DEFAULT_BOOK_COVER_URL : book.bookCoverUrl;
        this.setState(newState);
    }

    handleIsbnSubmit(form) {
        form.preventDefault();
        IsbnService.getBookInfo(this.state.enteredIsbn)
            .then(response => {
                if (response == null) {
                    let newState = Object.assign({}, this.state);
                    newState.smartAddStatus = this.bookNotFound;
                    this.setState(newState);
                } else {
                    this.loadBook(response);
                    let newState = Object.assign({}, this.state);
                    newState.smartAddStatus = this.validIsbnSubmitted;
                    this.setState(newState);
                }
            })
    }

    handleSmartAddAlertDismiss() {
        let newState = Object.assign({}, this.state);
        newState.smartAddStatus = this.starting;
        this.setState(newState);
    }

    renderSmartAddStatusAlert() {
        if (this.state.smartAddStatus !== this.bookNotFound) {
            return null;
        }

        return (
            <Row className="smart-add-alert">
                <Col sm={6}>
                    <Alert bsStyle="warning">
                        No se encontró información de ningún libro con el ISBN suministrado
                        <p><Button onClick={() => this.handleSmartAddAlertDismiss()}>Ok</Button></p>
                    </Alert>
                </Col>
            </Row>
        );
    }

    render() {
        if (this.state.smartAddStatus !== this.validIsbnSubmitted) {
            return (
                <Grid>
                    <Row>
                        <form onSubmit={form => this.handleIsbnSubmit(form)}>
                            <FormGroup>
                                <ControlLabel>Agregado inteligente</ControlLabel>
                                <FormControl
                                    type="text"
                                    placeholder="ISBN o ISBN 13"
                                    value = {this.state.enteredIsbn}
                                    onChange = {(input) => this.handleIsbnChange(input)}
                                />
                                <FormControl.Feedback />
                                <HelpBlock>Ingrese el codigo ISBN o ISBN 13 del libro que desea agregar</HelpBlock>
                            </FormGroup>
                            <Button bsStyle="primary" disabled={this.state.enteredIsbn.length === 0} type="submit">Confirmar</Button>
                        </form>
                    </Row>
                    {this.renderSmartAddStatusAlert()}
                </Grid>
            );
        } else {
            let newState = Object.assign({}, this.state);
            return (
                <Row><Button>Cancelar</Button></Row>,
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
                             title="Agregar libro"
                />
            );
        }
    }
}

export default SmartAdd;