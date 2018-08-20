import React, {Component} from 'react'
import {Grid, Row, Col, Panel, Table, Button, Modal} from 'react-bootstrap';
import { checkImage } from "../utils/ImageUtils";

import BookService from '../services/book_service';
import AuthenticateService from '../services/authenticate_service';

import {DEFAULT_BOOK_COVER_URL} from "../constants";

import '../assets/css/BookInfo.css';
import {LinkContainer} from "react-router-bootstrap/lib/ReactRouterBootstrap";
import {Link, Redirect} from "react-router-dom";
import DatePicker from 'react-16-bootstrap-date-picker';
import UserSearchTypeahead from "./UserSearchTypeahead";
import LoanService from "../services/loan_service";

class BookInfo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            book: null,
            bookCoverUrl: '',
            isAdministrator: false,
            showDeleteModal: false,
            redirectToBooks: false,
            showLoanModal: false,
            loanUser: null,
            loanReturnDate: null,
            bookLoans: [],
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
            this.loadLoans();
        });
    }

    loadLoans() {
        LoanService.getBookLoans(this.state.book.id)
            .then(response => {
                let newState = Object.assign({}, this.state);
                newState.bookLoans = response;
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
        let newState = Object.assign({}, this.state);
        newState.showDeleteModal = false;
        newState.showLoanModal = false;
        this.setState(newState);
    }

    handleLoanClick() {
        let newState = Object.assign({}, this.state);
        newState.showLoanModal = true;
        this.setState(newState);
    }

    handleUserSelect(selectedOption) {
        let newState = Object.assign({}, this.state);
        newState.loanUser = selectedOption[0];
        this.setState(newState);
    }

    handleLoanUserChange() {
        let newState = Object.assign({}, this.state);
        newState.loanUser = null;
        this.setState(newState);
    }

    handleReturnDateChange(date) {
        let newState = Object.assign({}, this.state);
        newState.loanReturnDate = date;
        this.setState(newState);
    }

    handleLoanConfirm() {
        LoanService.makeLoan(this.state.loanUser.id, this.state.book.id, this.state.loanReturnDate)
            .then( () => {
                    this.loadLoans();
                    this.handleModalClose();
                }
            );
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
                    <Row className="book-info-button">
                        <Button onClick={() => this.handleLoanClick()}
                                disabled={this.state.book.copies <= this.state.bookLoans.length}>Hacer Préstamo</Button>
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

    renderUserSelection() {
        if (this.state.loanUser === null) {
            return (
                <UserSearchTypeahead handleUserSelect={(selectedOption) => this.handleUserSelect(selectedOption)}/>
            );
        }

        return (
            <Panel>
                <Panel.Body>
                    {this.state.loanUser.firstName + " " + this.state.loanUser.lastName}
                    <Button onClick={() => this.handleLoanUserChange()} className="pull-right" bsSize="xsmall" bsStyle="info">Cambiar</Button>
                </Panel.Body>
            </Panel>
        );
    }

    renderLoanModal() {
        if (!this.state.showLoanModal) {
            return null;
        }

        return (
            <Modal show={this.state.showLoanModal} onHide={() => this.handleModalClose()}>
                <Modal.Header closeButton>
                    <Modal.Title>Prestar libro: <em>{this.state.book.title}</em></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Prestar libro a</p>
                    {this.renderUserSelection()}
                    <p className={"book-info-button"}>Fecha de devolución</p>
                    {this.renderDatePicker()}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => this.handleModalClose()}>Cancelar</Button>
                    <Button onClick={() => this.handleLoanConfirm()} bsStyle="primary"
                            disabled={this.state.loanUser === null || this.state.loanReturnDate === null}>Prestar</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    renderDatePicker() {
        return (
            <DatePicker onChange={(date) => this.handleReturnDateChange(date)} value={this.state.loanReturnDate}/>
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

    renderLoans() {
        if (this.state.bookLoans.length === 0 || !this.state.isAdministrator) {
            return null;
        }

        let loanElements = [];
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        for (let loan of this.state.bookLoans) {
            let startDate = new Date(loan.loan_date);
            let endDate = new Date(loan.return_date);
            loanElements.push(
                <tr>
                    <td>
                        <Link to={"/users/" + loan.reader.id}>
                            {loan.reader.first_name + " " + loan.reader.last_name}
                        </Link>
                    </td>
                    <td>{startDate.toLocaleDateString("es-CR", options)}</td>
                    <td>{endDate.toLocaleDateString("es-CR", options)}</td>
                </tr>
        )
        }

        return (
            <Panel bsStyle="primary">
                <Panel.Heading>
                    <Panel.Title componentClass="h3">Préstamos</Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                    <Table hover>
                        <tr>
                            <th>Lector</th>
                            <th>Fecha de inicio</th>
                            <th>Fecha esperada de devolución</th>
                        </tr>
                        <tbody>
                        {loanElements}
                        </tbody>
                    </Table>
                </Panel.Body>
            </Panel>
        )
        }

        render() {
            if (this.state.book !== null) {
            return (
            <Grid>
            {this.renderRedirect()}
            {this.renderDeleteModal()}
            {this.renderLoanModal()}
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
            {this.renderLoans()}
            </Row>
            </Grid>
            );
        }
            return null; // don't render anything if a book has not loaded
        }
        }

        export default BookInfo;