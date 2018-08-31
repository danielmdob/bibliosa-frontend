import React, {Component} from 'react'
import {Grid, Row, Col, Panel, Table, Button, FormControl} from 'react-bootstrap';
import '../assets/css/BookInfo.css';
import UserService from "../services/user_service";

class UserInfo extends Component {
    originalUser = null;

    constructor(props) {
        super(props);

        this.state = {
            user: null,
            editModeEnabled: false,
        }
        this.loadUser();
    }

    loadUser() {
        UserService.getUserInformationById(this.props.match.params.userId).then(response => {
            let newState = Object.assign({}, this.state);
            newState.user = {...response};
            this.originalUser = {...response};
            this.setState(newState);
        });
    }

    handleEditStart() {
        let newState = Object.assign({}, this.state);
        newState.editModeEnabled = true;
        this.setState(newState);
    }

    handleEditCancel() {
        let newState = Object.assign({}, this.state);
        newState.editModeEnabled = false;
        newState.user = Object.assign({}, this.originalUser);
        this.setState(newState);
    }

    handleFirstNameChange(input) {
        let newState = Object.assign({}, this.state);
        newState.user.firstName = input.target.value;
        this.setState(newState);
    }

    handleLastNameChange(input) {
        let newState = Object.assign({}, this.state);
        newState.user.lastName = input.target.value;
        this.setState(newState);
    }

    handleCardNumberChange(input) {
        let newState = Object.assign({}, this.state);
        newState.user.cardNumber = input.target.value;
        this.setState(newState);
    }

    handleSubmit(form) {
        form.preventDefault();
        UserService.editOtherUser(this.state.user.id, this.state.user.firstName, this.state.user.lastName, this.state.user.cardNumber)
            .then( () => {
                let newState = Object.assign({}, this.state);
                newState.editModeEnabled = false;
                this.setState(newState);
                this.loadUser()
            });
    }

    renderFirstName() {
        if (!this.state.editModeEnabled) {
            return this.state.user.firstName;
        }

        return (
            <FormControl
                type="text"
                value={this.state.user.firstName}
                placeholder="Nombre"
                onChange={(input) => this.handleFirstNameChange(input)}
            />
        )
    }

    renderLastName() {
        if (!this.state.editModeEnabled) {
            return this.state.user.lastName;
        }

        return (
            <FormControl
                type="text"
                value={this.state.user.lastName}
                placeholder="Apellido"
                onChange={(input) => this.handleLastNameChange(input)}
            />
        )
    }

    renderCardNumber() {
        if (!this.state.editModeEnabled) {
            return this.state.user.cardNumber;
        }

        return (
            <FormControl
                type="text"
                value={this.state.user.cardNumber}
                placeholder="Correo"
                onChange={(input) => this.handleCardNumberChange(input)}
            />
        )
    }


    renderEditButtons() {
        if (!this.state.editModeEnabled) {
            return (
                <Button onClick={() => this.handleEditStart()}>
                    Editar
                </Button>
            );
        }

        return (
            <div>
                <Button onClick={() => this.handleEditCancel()}>
                    Cancelar
                </Button>
                {" "}
                <Button
                    onClick={() => this.handleEditStart()}
                    bsStyle="primary"
                    disabled={this.state.user.firstName.trim().length === 0 || this.state.user.lastName.trim().length === 0}
                    type="submit"
                >
                    Confirmar
                </Button>
            </div>
        );
    }

    render() {
        if (this.state.user === null) {
            return null;
        }

        return (
            <Grid>
                <Row>
                    <Panel bsStyle="primary">
                        <Panel.Heading>
                            <Panel.Title componentClass="h3">Información de {this.originalUser.firstName}</Panel.Title>
                        </Panel.Heading>
                        <form onSubmit={form => this.handleSubmit(form)}>
                            <Panel.Body>
                                <Col sm={9}>

                                    <Table striped hover>
                                        <tbody>
                                        <tr>
                                            <th>Nombre</th>
                                            <td>{this.renderFirstName()}</td>
                                        </tr>
                                        <tr>
                                            <th>Apellido</th>
                                            <td>{this.renderLastName()}</td>
                                        </tr>
                                        <tr>
                                            <th>Correo</th>
                                            <td>{this.state.user.email}</td>
                                        </tr>
                                        <tr>
                                            <th>Número de carnet</th>
                                            <td>{this.renderCardNumber()}</td>
                                        </tr>
                                        </tbody>
                                    </Table>

                                </Col>
                                <Col sm={3} className="text-center">
                                    <Row>
                                        {this.renderEditButtons()}
                                    </Row>
                                </Col>
                            </Panel.Body>
                        </form>
                    </Panel>
                </Row>
            </Grid>
        );
    }

}

export default UserInfo;