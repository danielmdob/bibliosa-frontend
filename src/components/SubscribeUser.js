import React, {Component} from 'react'
import {
    Grid,
    Row,
    Col,
    FormGroup,
    FormControl,
    Button,
    Alert,
    ControlLabel
} from 'react-bootstrap';

import UserService from '../services/user_service';
import {EMAIL_REGEX} from "../constants";
import {Link} from "react-router-dom";

import '../assets/css/SubscribeUser.css';

class SubscribeUser extends Component {
    starting = 'STARTING';
    success = 'SUCCESS';
    conflict = 'CONFLICT';

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            firstName: '',
            lastName: '',
            cardNumber: '',
            status: this.starting,
            user: null,
        };
    }

    handleFirstNameChange(input) {
        let newState = Object.assign({}, this.state);
        newState.firstName = input.target.value;
        this.setState(newState);
    }

    handleLastNameChange(input) {
        let newState = Object.assign({}, this.state);
        newState.lastName = input.target.value;
        this.setState(newState);
    }

    handleEmailChange(input) {
        let newState = Object.assign({}, this.state);
        newState.email = input.target.value;
        this.setState(newState);
    }

    handleCardNumberChange(input) {
        let newState = Object.assign({}, this.state);
        newState.cardNumber = input.target.value;
        this.setState(newState);
    }

    handleSubmit(form) {
        form.preventDefault();
        UserService.subscribeUser(this.state.email, this.state.firstName, this.state.lastName, this.state.cardNumber)
            .then(response => {
                let newState = Object.assign({}, this.state);
                newState.user = response;
                newState.status = this.success;
                this.setState(newState);
            }).catch(error => {
            if (error.response.status === 409) {
                let newState = Object.assign({}, this.state);
                newState.user = error.response.data;
                newState.status = this.conflict;
                this.setState(newState);
            }
        })

    }

    renderStatusAlert() {
        switch (this.state.status) {
            case this.starting:
                return null;

            case this.success:
                return (
                    <Alert bsStyle="success" className="subscribe-user-add-status">
                        Se ha agregado exitosamente a <Link to={"/users/" + this.state.user.id}>{this.state.firstName + " " + this.state.lastName}</Link>.
                    </Alert>
                );

            case this.conflict:
                return (
                    <Alert bsStyle="warning" className="subscribe-user-add-status">
                        El usuario <Link to={"/users/" + this.state.user.id}>{this.state.user.firstName + " " + this.state.user.lastName}</Link> ya usa ese correo o número de carnet.
                    </Alert>
                );

            default:
        }
    }

    render() {
        return (
            <Grid>
                <Row>
                    <Col sm={8}>
                        <form onSubmit={form => this.handleSubmit(form)}>
                            <FormGroup>
                                <ControlLabel>Nombre</ControlLabel>
                                <FormControl
                                    type="text"
                                    value={this.state.firstName}
                                    placeholder="Nombre"
                                    onChange={input => this.handleFirstNameChange(input)}
                                />
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>Apellido</ControlLabel>
                                <FormControl
                                    type="text"
                                    value={this.state.lastName}
                                    placeholder="Apellido"
                                    onChange={input => this.handleLastNameChange(input)}
                                />
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>Número de carnet</ControlLabel>
                                <FormControl
                                    type="text"
                                    value={this.state.cardNumber}
                                    placeholder="Número de carnet"
                                    onChange={input => this.handleCardNumberChange(input)}
                                />
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>Correo</ControlLabel>
                                <FormControl
                                    type="text"
                                    value={this.state.email}
                                    placeholder="Correo"
                                    onChange={input => this.handleEmailChange(input)}
                                />
                            </FormGroup>
                            <Row>
                                <FormGroup>
                                    <Col className="pull-right">
                                        <Button bsStyle="primary" type="submit"
                                                disabled={this.state.firstName.trim().length === 0 || this.state.lastName.trim().length === 0
                                                || this.state.cardNumber.trim().length === 0
                                                || ((this.state.email.length === 0) !== (!this.state.email.match(EMAIL_REGEX)))}
                                        >
                                            Guardar
                                        </Button>
                                    </Col>
                                </FormGroup>
                            </Row>
                        </form>

                    </Col>

                    <Col sm={4}>
                        {this.renderStatusAlert()}
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default SubscribeUser;