import React, {Component} from 'react'
import {Grid, Row, Col, Panel, Table, Button, Modal} from 'react-bootstrap';
import { checkImage } from "../utils/ImageUtils";

import BookService from '../services/book_service';
import AuthenticateService from '../services/authenticate_service';

import {DEFAULT_BOOK_COVER_URL} from "../constants";

import '../assets/css/BookInfo.css';
import {LinkContainer} from "react-router-bootstrap/lib/ReactRouterBootstrap";
import {Link, Redirect} from "react-router-dom";

class BookInfoComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            book: null,
            bookCoverUrl: '',
            isAdministrator: false,
            showDeleteModal: false,
            redirectToBooks: false,
        };

        this.checkIfAdmin();
        this.loadBook();
    }

    checkIfAdmin() {
        AuthenticateService.isAdministrator()
            .then(response => {
                if (response !== this.state.isAdministrator) {
                    let newState = Object.assign({}, this.state);
                    newState.isAdministrator = response;
                    this.setState(newState);
                }
            })
    }

    loadBook() {
        BookService.getBookInfo(this.props.match.params.bookId).then(response => {
            let newState = Object.assign({}, this.state);
            newState.book = response;
            newState.bookCoverUrl = response.cover;
            this.setState(newState);
        });
    }

    handleDeleteClick() {
        let newState = Object.assign({}, this.state);
        newState.showDeleteModal = true;
        this.setState(newState);
    }

    handleDeleteConfirm() {
        BookService.deleteBook(this.state.book.id).then(() => {
            let newState = Object.assign({}, this.state);
            newState.redirectToBooks = true;
            this.setState(newState);
        });
    }

    handleModalClose() {
        this.state.showDeleteModal = false;
    }

    renderAuthors() {
        if (this.state.book.authors != null && this.state.book.authors.length > 0) {
            let authors = this.state.book.authors.slice();
            let firstAuthor = authors.shift();
            let content = [];
            content.push(
                <tr key={0}>
                    <th rowSpan={authors.length + 1}>Autores</th>
                    <td><Link to={"/author/" +  firstAuthor.id}>{firstAuthor.full_name}</Link></td>
                </tr>
            );
            let key = 1;
            for (let author of authors) {
                content.push(<tr key={key}><td><Link to={"/author/" +  author.id}>{author.full_name}</Link></td></tr>);
                key++;
            }
            return content;
        }
    }

    renderCategory() {
        if (this.state.book.category !== null) {
            return this.state.book.category.name;
        }
    }

    renderCover() {
        checkImage(this.state.bookCoverUrl,
            null, // don't do anything if the image is valid
            () => {
                let newState = Object.assign({}, this.state);
                newState.bookCoverUrl = DEFAULT_BOOK_COVER_URL;
                this.setState(newState);
            });
        return (
            <img src={this.state.bookCoverUrl} alt="Sin portada" className="book-info-cover" />
        )
    }

    renderAdminButtons() {
        if (this.state.isAdministrator) {
            return(
                <div>
                    <Row className="book-info-button">
                        <LinkContainer to={"/books/" + this.props.match.params.bookId + "/edit"} >
                            <Button>Editar información</Button>
                        </LinkContainer>
                    </Row>
                    <Row className="book-info-button">
                        <Button onClick={() => this.handleDeleteClick()}>Eliminar</Button>
                    </Row>
                </div>
            )
        }
    }

    renderDeleteModal() {
        if (!this.state.showDeleteModal) {
            return null;
        }

        return (
            <Modal show={this.state.showDeleteModal} onHide={() => this.handleModalClose()}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>¿Está seguro que quiere borrar el libro {this.state.book.title}?</p>
                    <p>Esto también eliminará la información relacionada con los préstamos de este libro.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => this.handleModalClose()}>No</Button>
                    <Button onClick={() => this.handleDeleteConfirm()} bsStyle="primary">Sí</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    renderRedirect() {
        if (!this.state.redirectToBooks) {
            return null;
        }

        return (
            <Redirect to="/books" />
        );
    }

    render() {
        if (this.state.book !== null) {
            return (
                <Grid>
                    {this.renderRedirect()}
                    {this.renderDeleteModal()}
                    <Row>
                        <Panel bsStyle="primary">
                            <Panel.Heading>
                                <Panel.Title componentClass="h3">Información del libro</Panel.Title>
                            </Panel.Heading>
                            <Panel.Body>
                                <Col sm={9}>
                                    <Table striped hover>
                                        <tbody>
                                        <tr>
                                            <th>Título</th>
                                            <td>{this.state.book.title}</td>
                                        </tr>
                                        {this.renderAuthors()}
                                        <tr>
                                            <th>Categoría</th>
                                            <td>{this.renderCategory()}</td>
                                        </tr>
                                        <tr>
                                            <th>ISBN</th>
                                            <td>{this.state.book.isbn10}</td>
                                        </tr>
                                        <tr>
                                            <th>ISBN 13</th>
                                            <td>{this.state.book.isbn13}</td>
                                        </tr>
                                        <tr>
                                            <th>ISSN</th>
                                            <td>{this.state.book.issn}</td>
                                        </tr>
                                        <tr>
                                            <th>Número de categorización</th>
                                            <td>{this.state.book.call_number}</td>
                                        </tr>
                                        <tr>
                                            <th>Edición</th>
                                            <td>{this.state.book.edition}</td>
                                        </tr>
                                        <tr>
                                            <th>Año</th>
                                            <td>{this.state.book.year}</td>
                                        </tr>
                                        <tr>
                                            <th>Editorial</th>
                                            <td>{this.state.book.publisher}</td>
                                        </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                                <Col sm={3} xsHidden className="text-center">
                                    <Row>
                                        {this.renderCover()}
                                    </Row>
                                    <Row>
                                        {this.renderAdminButtons()}
                                    </Row>
                                </Col>
                            </Panel.Body>
                        </Panel>
                    </Row>
                </Grid>
            );
        }
        return null; // don't render anything if a book has not loaded
    }
}

export default BookInfoComponent;