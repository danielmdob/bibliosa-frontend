import React from 'react';
import {Col, Button, Form, FormControl, FormGroup, ControlLabel, DropdownButton, MenuItem, Grid, Row} from 'react-bootstrap';

import '../assets/css/AddBookForm.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import {Typeahead} from "react-bootstrap-typeahead";

const renderImage = (props) => {
    return (<img className="cover" src={props.parentState.bookCoverUrl} alt="Sin portada"/>);
};

const renderAuthorsInput = (props) => {
    return (
        <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>
                Autores
            </Col>
            <Col sm={9}>
                <Typeahead
                    allowNew
                    multiple
                    newSelectionPrefix="Agregar autor: "
                    options={[]}
                    onChange={(selected) => props.handleAuthorsChange(selected)}
                    emptyLabel=""
                    placeholder="Ingrese los nombres de los autores..."
                    selected={props.parentState.authors}
                />
            </Col>
        </FormGroup>
    );
}

const AddBookForm = (props) => {
    let categoryElements = [];
    for (let i = 0; i < props.parentState.categories.length; i++) {
        categoryElements.push(
            <MenuItem key={i} eventKey={props.parentState.categories[i]} onSelect={props.onCategorySelect}>{props.parentState.categories[i].name}</MenuItem>
        );
    }

    return (
        <Grid>
            <Row>
                <Col sm={8}>
                    <Row>
                        <Col xs={12}>
                            <h3 className="page-title">{props.title}</h3>
                        </Col>
                    </Row>
                    <Form horizontal className="add-book-form" onSubmit={(form) => props.handleSubmit(form)}>

                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={3}>
                                Categoría
                            </Col>
                            <Col sm={9}>
                                <DropdownButton
                                    title={props.parentState.selectedCategory === null ? "Categoría" : props.parentState.selectedCategory.name}
                                    key="37"
                                    id="779"
                                    value="x"
                                >
                                    {categoryElements}
                                </DropdownButton>
                            </Col>
                        </FormGroup>

                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={3}>
                                Título
                            </Col>
                            <Col sm={9}>
                                <FormControl placeholder="Título" value={props.parentState.title}
                                onChange={titleInput => props.handleTitleChange(titleInput)} />
                            </Col>
                        </FormGroup>
                        {renderAuthorsInput(props)}
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={3}>
                                ISBN
                            </Col>
                            <Col sm={9}>
                                <FormControl placeholder="ISBN" value={props.parentState.isbn10}
                                             onChange={isbn10Input => props.handleIsbn10Change(isbn10Input)}  />
                            </Col>
                        </FormGroup>

                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={3}>
                                ISBN 13
                            </Col>
                            <Col sm={9}>
                                <FormControl placeholder="ISBN 13" value={props.parentState.isbn13}
                                             onChange={isbn13Input => props.handleIsbn13Change(isbn13Input)} />
                            </Col>
                        </FormGroup>

                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={3}>
                                ISSN
                            </Col>
                            <Col sm={9}>
                                <FormControl placeholder="ISSN" value={props.parentState.issn}
                                             onChange={issnInput => props.handleIssnChange(issnInput)}  />
                            </Col>
                        </FormGroup>

                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={3}>
                                Número de categorización
                            </Col>
                            <Col sm={9}>
                                <FormControl placeholder="Número de categorización" value={props.parentState.callNumber}
                                             onChange={callNumberInput => props.handleCallNumberChange(callNumberInput)} />
                            </Col>
                        </FormGroup>

                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={3}>
                                Editorial
                            </Col>
                            <Col sm={9}>
                                <FormControl placeholder="Editorial" value={props.parentState.publisher}
                                             onChange={publisherInput => props.handlePublisherChange(publisherInput)} />
                            </Col>
                        </FormGroup>

                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={3}>
                                Edición
                            </Col>
                            <Col sm={9}>
                                <FormControl placeholder="Edición" value={props.parentState.edition}
                                             onChange={editionInput => props.handleEditionChange(editionInput)} />
                            </Col>
                        </FormGroup>

                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={3}>
                                Año
                            </Col>
                            <Col sm={9}>
                                <FormControl placeholder="Año" value={props.parentState.year}
                                             onChange={yearInput => props.handleYearChange(yearInput)} />
                            </Col>
                        </FormGroup>

                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={3}>
                                Número de copias
                            </Col>
                            <Col sm={9}>
                                <FormControl placeholder="Número de copias" value={props.parentState.copies}
                                onChange={copiesInput => props.handleCopiesChange(copiesInput)}/>
                            </Col>
                        </FormGroup>

                        <FormGroup>
                            <Col sm={10}>
                            </Col>
                            <Col sm={2}>
                                <Button bsStyle="primary" type="submit" disabled={props.parentState.title.trim().length === 0}>Guardar</Button>
                            </Col>
                        </FormGroup>
                    </Form>
                </Col>
                <Col sm={4} className="hidden-xs">
                    <Row>
                        <div className="cover-area">
                            <h4 className="cover-title">Portada</h4>
                            <div className="text-center">
                                {renderImage(props)}
                            </div>
                            <Form className="url-form" horizontal>
                                <FormGroup>
                                    <Col componentClass={ControlLabel} sm={3}>
                                        URL
                                    </Col>
                                    <Col sm={9}>
                                        <FormControl placeholder="URL"
                                                     onChange={urlInput => props.handleBookCoverUrlChange(urlInput)} />
                                    </Col>
                                </FormGroup>
                            </Form>
                        </div>
                    </Row>
                    {props.renderStatusAlert()}
                </Col>
            </Row>
        </Grid>
    );
};

export default AddBookForm;