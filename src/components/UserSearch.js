import React, {Component} from 'react';

import {Col, FormGroup, Grid, Panel, Row} from "react-bootstrap";
import UserSearchTypeahead from "./UserSearchTypeahead";
import {Redirect} from "react-router-dom";


class UserSearch extends Component {

    constructor(props) {
        super(props);

        this.state = {
            foundUser: null,
        };
    }

    handleUserSelect(selectedOption) {
        let newState = Object.assign({}, this.state);
        newState.foundUser = selectedOption[0];
        this.setState(newState);
    }

    render() {
        if (this.state.foundUser !== null) {
            return (
                <Redirect to={"/users/" + this.state.foundUser.id} />
            )
        }

        return (
            <Grid>
                <Row>
                    <Col sm={6}>
                        <Panel bsStyle="info">
                            <Panel.Heading>Buscar</Panel.Heading>
                            <Panel.Body>
                                <FormGroup>
                                    <UserSearchTypeahead
                                        handleUserSelect={(selectedOption) => this.handleUserSelect(selectedOption)}/>
                                </FormGroup>
                            </Panel.Body>
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default UserSearch;