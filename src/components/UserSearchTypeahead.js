import React, {Component} from 'react'
import {InputGroup, DropdownButton, MenuItem} from 'react-bootstrap';

import UserService from '../services/user_service';
import {AsyncTypeahead} from "react-bootstrap-typeahead";

class UserSearchTypeahead extends Component {
    firstName = "Nombre";
    lastName = "Apellido";
    cardNumber = "Número de carnet";

    constructor(props) {
        super(props);

        this.state = {
            dropdownProps: {
                title: 'Nombre',
            },
            typeaheadProps: {
                options: [],
                isLoading: false,
            }
        };
    }

    handleSearchFieldSelect(selected) {
        let newState = Object.assign({}, this.state);
        newState.dropdownProps.title = selected;
        this.setState(newState);
    }

    handleSearch(input) {
        let newState = Object.assign({}, this.state);
        newState.typeaheadProps.isLoading = true;
        this.setState(newState);
        if (this.state.dropdownProps.title === this.firstName) {
            UserService.firstNameSearch(input)
                .then(response => {
                    let newState = Object.assign({}, this.state);
                    newState.typeaheadProps.options = response;
                    newState.typeaheadProps.isLoading = false;
                    this.setState(newState);
                });
        } else if (this.state.dropdownProps.title === this.lastName) {

        } else if (this.state.dropdownProps.title === this.cardNumber) {

        }
    }

    renderSearchFieldDropdown() {
        return (
            <DropdownButton
                {...this.state.dropdownProps}
                bsStyle="info"
                id="dropdown"
                key={12}
            >
                <MenuItem key={509} eventKey={this.firstName} onSelect={(selected) => this.handleSearchFieldSelect(selected)}>{this.firstName}</MenuItem>
                <MenuItem key={510} eventKey={this.lastName} onSelect={(selected) => this.handleSearchFieldSelect(selected)}>{this.lastName}</MenuItem>
                <MenuItem key={511} eventKey={this.cardNumber} onSelect={(selected) => this.handleSearchFieldSelect(selected)}>{this.cardNumber}</MenuItem>
            </DropdownButton>
        );
    }

    render() {
        return (
            <InputGroup>
                <InputGroup.Button>
                    {this.renderSearchFieldDropdown()}
                </InputGroup.Button>
                <AsyncTypeahead
                    {...this.state.typeaheadProps}
                    onSearch={(input) => this.handleSearch(input)}
                    labelKey={(option) => `${option.firstName} ${option.lastName}`}
                    useCache={false}
                    emptyLabel="No se obtuvieron resultados."
                    minLength={3}
                    onChange={(selectedOption) => this.props.handleUserSelect(selectedOption)}
                />
            </InputGroup>
        );
    }
}

export default UserSearchTypeahead;