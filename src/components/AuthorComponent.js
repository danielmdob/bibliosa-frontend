import React, {Component} from 'react';
import AuthorService from "../services/author_service";

import {
    Col,
    Grid,
    Panel,
    Row,
    Table
} from "react-bootstrap";

import {Link} from "react-router-dom";

class AuthorComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            author: null,
        };
        this.loadAuthor()
    }

    loadAuthor() {
        AuthorService.getAuthorInfo(this.props.match.params.authorId)
            .then(response => {
                let newState = Object.assign({}, this.state);
                newState.author = response;
                this.setState(newState);
            });
    }

    renderBooks() {
        let bookRows = [];
        let key = 900;
        for (let book of this.state.author.books) {
            bookRows.push(
                <tr key={key}>
                    <td><Link to={"/books/" + book.id}>{book.title}</Link></td>
                    <td>{book.call_number}</td>
                    <td>{book.isbn10}</td>
                </tr>
            );
            key++;
        }
        return bookRows;
    }

    render() {
        if (this.state.author === null) {
            return null
        }
        return (
            <Grid>
                <Row>
                    <Col sm={6}>
                        <Panel bsStyle="info">
                            <Panel.Heading>
                                <Panel.Title componentClass="h3">Autor</Panel.Title>
                            </Panel.Heading>
                            <Panel.Body>
                                <h4>{this.state.author.full_name}</h4>
                            </Panel.Body>
                        </Panel>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <Panel bsStyle="info" defaultExpanded>
                            <Panel.Heading>
                                <Panel.Title toggle componentClass="h3">Libros</Panel.Title>
                            </Panel.Heading>
                            <Panel.Collapse>
                                <Panel.Body>
                                    <Table>
                                        <thead>
                                        <tr>
                                            <th>Título</th>
                                            <th># Categorización</th>
                                            <th>ISBN</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.renderBooks()}
                                        </tbody>
                                    </Table>
                                </Panel.Body>
                            </Panel.Collapse>
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default AuthorComponent;