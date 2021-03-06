import React, {Component} from 'react'
import {LinkContainer} from 'react-router-bootstrap';
import {LIBRARY_NAME} from "../constants";

import AuthenticateService from '../services/authenticate_service';
import UserService from '../services/user_service'

import '../assets/css/Navigation.css';
import {Navbar, NavItem, NavDropdown, Nav, MenuItem} from 'react-bootstrap';
import logo from '../assets/logo-default.png';

class Navigation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isAdministrator: false,
            firstName: '',
            isSubscribed: false,
        };
        Promise.all([AuthenticateService.isAdministrator(), UserService.getUserInformation()])
            .then(values => {
                let newState = Object.assign({}, this.state);
                newState.isAdministrator = values[0];
                newState.firstName = values[1].firstName;
                newState.isSubscribed = values[1].isSubscribed;
                this.setState(newState);
            });
    }

    renderAdminButtons() {
        if (this.state.isAdministrator === true) {
            return (
                [
                    <LinkContainer key={999} to="/categories">
                        <NavItem eventKey={2}>
                            <span className="link">Categorías</span>
                        </NavItem>
                    </LinkContainer>,
                    <NavDropdown key={1000} eventKey={4} title="Usuarios" id="basic-nav-dropdown" className="link">
                        <LinkContainer to="/user-search">
                            <MenuItem eventKey={4.1}>Buscar Usuario</MenuItem>
                        </LinkContainer>
                        <LinkContainer to="/subscribe-user">
                            <MenuItem eventKey={4.1}>Inscribir Usuario</MenuItem>
                        </LinkContainer>
                        <MenuItem divider/>
                        <LinkContainer to="/add-administrator">
                            <MenuItem eventKey={4.1}>Agregar Administradores</MenuItem>
                        </LinkContainer>
                    </NavDropdown>,
                    <NavDropdown key={1001} eventKey={5} title="Agregar Libro" id="basic-nav-dropdown">
                        <LinkContainer to="/smart-add">
                            <MenuItem eventKey={5.1}>Agregado Inteligente</MenuItem>
                        </LinkContainer>
                        <MenuItem divider/>
                        <LinkContainer to="/manual-add">
                            <MenuItem eventKey={5.2}>Agregado Manual</MenuItem>
                        </LinkContainer>
                    </NavDropdown>
                ]
            );
        }
    }

    renderSubscribedButtons() {
        if (!this.state.isSubscribed) {
            return null;
        }

        return (
            <LinkContainer to="/loans">
                <NavItem eventKey={2}>
                    <span className="link">Préstamos</span>
                </NavItem>
            </LinkContainer>
        );
    }

    render() {

        return (
            <Navbar className="nav-bar" collapseOnSelect>
                <Navbar.Header>
                    <img src={logo} className="logo" alt=""/>
                    <span className="library-name">{LIBRARY_NAME}</span>
                    <Navbar.Toggle/>
                </Navbar.Header>
                <Navbar.Collapse>
                    <div className="links">
                        <Nav>
                            <LinkContainer to="/books">
                                <NavItem eventKey={1}>
                                    <span className="link">Libros</span>
                                </NavItem>
                            </LinkContainer>
                            {this.renderSubscribedButtons()}
                            {this.renderAdminButtons()}
                        </Nav>
                    </div>
                    <Nav pullRight>
                        <NavDropdown eventKey={3}
                                     title={<span><i className="far fa-user"></i> {this.state.firstName} </span>}
                                     id="basic-nav-dropdown" className="link">
                            <MenuItem eventKey={3.1} onClick={() => this.handleClick()}>Cerrar Sesión</MenuItem>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }

    handleClick() {
        AuthenticateService.logout();
    }

}

export default Navigation;