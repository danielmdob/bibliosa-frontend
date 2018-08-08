import React, {Component} from 'react'
import {Grid, Row, Col, Panel, Table, Button, FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap';
import AddBookForm from './AddBookForm';
import SetBookComponent from './SetBookComponent';

import { checkImage } from "../utils/ImageUtils";

import IsbnService from '../services/isbn_service';

import {DEFAULT_BOOK_COVER_URL} from "../constants";

import '../assets/css/BookInfo.css';
import {LinkContainer} from "react-router-bootstrap/lib/ReactRouterBootstrap";

class SmartAddComponent extends SetBookComponent {

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

export default SmartAddComponent;