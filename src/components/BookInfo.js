import React, {Component} from 'react'
import {Grid, Row, Col, Panel, Table} from 'react-bootstrap';
import { checkImage } from "../utils/ImageUtils";

import BookService from '../services/book_service';

import {DEFAULT_BOOK_COVER_URL} from "../constants";

import '../assets/css/BookInfo.css';

class BookInfo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            book: null,
            bookCoverUrl: '',
        };

        this.loadBook();
    }

    loadBook() {
        BookService.getBookInfo(this.props.match.params.bookId).then(response => {
            let newState = Object.assign({}, this.state);
            newState.book = response;
            newState.bookCoverUrl = response.cover;
            this.setState(newState);
        });
    }

    renderAuthors() {
        if (this.state.book.authors != null && this.state.book.authors.length > 0) {
            let content = [];
            content.push(
                <tr key={0}>
                    <th rowSpan={this.state.book.authors.length}>Autores</th>
                    <td>{this.state.book.authors.shift().full_name}</td>
                </tr>
            );
            let key = 1;
            for (let author of this.state.book.authors) {
                content.push(<tr key={key}><td>{author.full_name}</td></tr>);
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
            <img src={this.state.bookCoverUrl} alt="Sin portada" className="cover" />
        )
    }

    render() {
        if (this.state.book !== null) {
            return (
                <Grid>
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
                                    {this.renderCover()}
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

export default BookInfo;