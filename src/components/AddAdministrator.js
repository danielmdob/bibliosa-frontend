import React, {Component} from 'react'
import {Grid, Row, Col, Alert, Button, Form, FormControl, FormGroup, ControlLabel} from 'react-bootstrap';

import {EMAIL_REGEX} from "../constants";
import AdministratorService from '../services/administrator_service'
import {Link} from "react-router-dom";

class AddAdministrator extends Component {
    success = 'SUCCESS';
    alreadyAnAdministrator = 'ALREADY_ADMIN';
    notFound = 'NOT_FOUND';

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            emailIsValid: false,
            invitationStatus: '',
        };

        this.handleChange.bind(this);
    }

    handleChange(inputData) {
        this.setState({
            email: inputData.target.value,
            emailIsValid: EMAIL_REGEX.test(inputData.target.value),
            inputStatus:'',
        })
    }

    handleSubmit(form) {
        form.preventDefault(); // stops the page from reloading
        let invitationStatus = '';
        AdministratorService.inviteAdministrator(this.state.email)
            .then(() => invitationStatus = this.success)
            .catch(error => {
                if (error.response.status === 404) {
                    invitationStatus = this.notFound;
                } else if (error.response.status === 409) {
                    invitationStatus = this.alreadyAnAdministrator;
                }
            })
            .then(() => {
               this.setState({
                   email: this.state.email,
                   emailIsValid: this.state.emailIsValid,
                   invitationStatus: invitationStatus,
               })
            });
    }

    handleDismiss() {
        let newState = Object.assign({}, this.state);
        newState.invitationStatus = '';
        this.setState(newState);
    }

    renderStatusAlert() {
        let style;
        let text;
        if (this.state.invitationStatus === this.success) {
            style = 'success';
            text = 'Se ha agregado el nuevo administrador exitosamente!'
        } else if (this.state.invitationStatus === this.notFound) {
            style = 'danger';
            text = (
                <span>No se encontró ningún usuario con ese correo, se necesita <Link to="/subscribe-user">inscribir al usuario</Link> poder para agregarlo como administrador</span>
            );
        } else if (this.state.invitationStatus === this.alreadyAnAdministrator) {
            style = 'warning';
            text = 'Ese usuario ya es un administrador';
        }

        if (style && this.state.invitationStatus !== '') {
            return (
                <Row>
                    <Col sm={4}>
                        <Alert bsStyle={style}>
                            {text}
                            <p><Button onClick={() => this.handleDismiss()}>Ok</Button></p>
                        </Alert>
                    </Col>
                </Row>

            );
        }
    }

    render() {
        return (
            <Grid>
                <Row>
                    <Col xs={12}>
                        <h3>Invitar administrador</h3>
                    </Col>
                </Row>
                <Row>
                    <Col xs={4}>
                        <Form inline onSubmit={form => this.handleSubmit(form)}>
                            <FormGroup controlId="formInlineEmail">
                                <ControlLabel>Correo </ControlLabel>{' '}
                                <FormControl type="email" placeholder="Correo" value={this.state.email} onChange={data => this.handleChange(data)} />
                            </FormGroup>{' '}
                            <Button bsStyle="primary" disabled={!this.state.emailIsValid} type="submit">Invitar</Button>
                        </Form>
                    </Col>
                    <Col xs={8}>
                        <Alert bsStyle="info">
                            Para poder invitar un administrador se necesita que la persona a invitar tenga una cuenta en el sistema.
                            <br />
                            Funciona solo para correos Gmail.
                        </Alert>
                    </Col>
                </Row>
                {this.renderStatusAlert()}
            </Grid>
        );
    }
}

export default AddAdministrator;