import React, {Component} from 'react';

import {Button, Col, Grid, Panel, Row, Table} from "react-bootstrap";
import LoanService from "../services/loan_service";
import {Link} from "react-router-dom";
import ConfirmLoanReceptionModal from "./ConfirmLoanReceptionModal"


class Loans extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loans: [],
            show: false,
            chosenLoan: null,
        };
        this.loadLoans();
    }

    loadLoans() {
        LoanService.getActiveLoans().then(
            response => {
                let newState = Object.assign({}, this.state);
                newState.loans = response;
                this.setState(newState);
            }
        )
    }

    handleClose() {
        let newState = Object.assign({}, this.state);
        newState.show = false;
        this.setState(newState);
    }

    handleReturnStart(loan) {
        let newState = Object.assign({}, this.state);
        newState.show = true;
        newState.chosenLoan = loan;
        this.setState(newState);
    }

    handleReturnConfirm() {
        LoanService.returnBook(this.state.chosenLoan.id)
            .then( () => {
                this.handleClose();
                this.loadLoans();
            })
    }

    renderLoansInfo() {
        let loanRows = [];
        let dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        let key = 88;
        for (let loan of this.state.loans) {
            let startDate = new Date(loan.loan_date);
            let endDate = new Date(loan.return_date);
            loanRows.push(
                <tr key={key}>
                    <td>
                        <Link to={"/books/" + loan.book.id}>
                            {loan.book.title}
                        </Link>
                    </td>
                    <td>
                        <Link to={"/users/" + loan.reader.id}>
                            {loan.reader.first_name + " " + loan.reader.last_name}
                        </Link>
                    </td>
                    <td>{startDate.toLocaleDateString("es-CR", dateOptions)}</td>
                    <td>{endDate.toLocaleDateString("es-CR", dateOptions)}</td>
                    <td><Button bsStyle="primary" onClick={() => this.handleReturnStart(loan)}>Marcar como recibido</Button></td>
                </tr>
            );
            key++;
        }
        return loanRows;
    }

    render() {
        return (
            <Grid>
                <ConfirmLoanReceptionModal {...this.state} handleClose={() => this.handleClose()} handleReturnConfirm={() => this.handleReturnConfirm()} />
                <Row>
                    <Col sm={12}>
                        <Panel bsStyle="info">
                            <Panel.Body>
                                <Table hover>
                                    <thead>
                                    <tr>
                                        <th>Libro</th>
                                        <th>Lector</th>
                                        <th>Fecha de inicio</th>
                                        <th>Fecha esperada de devolución</th>
                                        <th />
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.renderLoansInfo()}
                                    </tbody>
                                </Table>
                            </Panel.Body>
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default Loans;