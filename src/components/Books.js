import React, {Component} from 'react';
import BookService from "../services/book_service";

import {Col, DropdownButton, FormGroup, Grid, InputGroup, MenuItem, Panel, Row} from "react-bootstrap";
import {AsyncTypeahead} from "react-bootstrap-typeahead";
import {Redirect} from "react-router-dom";
import AuthorService from "../services/author_service";
import {LinkContainer} from "react-router-bootstrap";

import '../assets/css/Books.css';

class Books extends Component {

    title = "Título";
    author = "Autor";

    constructor(props) {
        super(props);

        this.state = {
            typeaheadIsLoading: false,
            selectedSearchField: this.title,
            searchFields: [this.title, this.author],
            searchOptions: [],
            redirectLink: '',
            newArrivals: [],
        };
        this.loadNewArrivals();
    }

    loadNewArrivals() {
        BookService.getNewArrivals()
            .then(response => {
                let newState = Object.assign({}, this.state);
                newState.newArrivals = response;
                this.setState(newState);
            })
    }

    handleSearchFieldSelect(selected) {
        let newState = Object.assign({}, this.state);
        newState.selectedSearchField = selected;
        this.setState(newState);
    }

    handleSearch(input) {
        let newState = Object.assign({}, this.state);
        newState.typeaheadIsLoading = true;
        this.setState(newState);
        if (this.state.selectedSearchField === this.title) {
            BookService.titleSearch(input)
                .then(response => {
                    let newState = Object.assign({}, this.state);
                    newState.searchOptions = response;
                    newState.typeaheadIsLoading = false;
                    this.setState(newState);
                });
        } else if (this.state.selectedSearchField === this.author) {
            AuthorService.search(input)
                .then(response => {
                    let newState = Object.assign({}, this.state);
                    newState.searchOptions = response;
                    newState.typeaheadIsLoading = false;
                    this.setState(newState);
                });
        }
    }

    handleChange(selectedOption) {
        let newState = Object.assign({}, this.state);
        if (this.state.selectedSearchField === this.title) {
            newState.redirectLink= "/books/" + selectedOption[0].id;
        } else if (this.state.selectedSearchField === this.author) {
            newState.redirectLink= "/author/" + selectedOption[0].id;
        }
        this.setState(newState);
    }

    renderSearchFieldDropdown() {
        let menuItems = [];
        let key = 100;
        for (let searchField of this.state.searchFields) {
            menuItems.push(
                <MenuItem key={key} eventKey={searchField} onSelect={(selected) => this.handleSearchFieldSelect(selected)}>{searchField}</MenuItem>
            );
            key++;
        }
        return (
            <DropdownButton
                bsStyle="info"
                title={this.state.selectedSearchField}
                id="dropdown"
                key={12}
            >
                {menuItems}
            </DropdownButton>
        );
    }

    renderTypeahead() {
        let labelKey;
        switch (this.state.selectedSearchField) {
            case this.title:
                labelKey = "title";
                break;

            case this.author:
                labelKey = "full_name";
                break;

            default:
        }
        return (
            <AsyncTypeahead
                isLoading={this.state.typeaheadIsLoading}
                minLength={3}
                onSearch={(input) => this.handleSearch(input)}
                placeholder={this.state.selectedSearchField}
                labelKey={labelKey}
                options={this.state.searchOptions}
                onChange={(selectedOption) => this.handleChange(selectedOption)}
                useCache={false}
                emptyLabel="No se obtuvieron resultados."
            />
        );
    }

    renderNewArrivals() {
        if (this.state.newArrivals.length === 0) {
            return null;
        }

        let thumbnails = [];
        let key = 0;
        for (let newArrival of this.state.newArrivals) {
            thumbnails.push(
                <Col sm={4} md={2} key={key}>
                    <LinkContainer to={"/books/" + newArrival.id}>
                        <div className="books-book-cover-div">
                            <img className="books-book-cover" alt="Sin Portada" src={newArrival.cover} />
                            <h5 className="text-center books-book-title">{newArrival.title}</h5>
                        </div>
                    </LinkContainer>
                </Col>
            );
            key++;
        }

        return (
            <div>
                <Row>
                    <h3 className="text-center">Agregados Recientemente</h3>
                </Row>
                <Row>
                    <Col md={1} smHidden={true} />
                    {thumbnails}
                </Row>
            </div>
        );
    }

    renderRedirect() {
        if (this.state.redirectLink !== '') {
            return (
                <Redirect to={this.state.redirectLink} />
            )
        }
        return null;
    }

    render() {
        return (
            <Grid>
                <Row>
                    <Col sm={6}>
                        <Panel bsStyle="info">
                            <Panel.Heading>Buscar</Panel.Heading>
                            <Panel.Body>
                                <FormGroup>
                                    <InputGroup>
                                        <InputGroup.Button>
                                            {this.renderSearchFieldDropdown()}
                                        </InputGroup.Button>
                                        {this.renderTypeahead()}
                                        {this.renderRedirect()}
                                    </InputGroup>
                                </FormGroup>
                            </Panel.Body>
                        </Panel>
                    </Col>
                </Row>
                {this.renderNewArrivals()}
            </Grid>
        );
    }
}

export default Books;