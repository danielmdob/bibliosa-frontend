import React from 'react';
import {Button, Modal} from "react-bootstrap";

const ConfirmLoanReceptionModal = (props) => {
    if (props.chosenLoan === null) {
        return null;
    }
    return (
        <Modal show={props.show} onHide={() => props.handleClose()}>
            <Modal.Header closeButton>
                <Modal.Title>Confirmar devolución: <em>{props.chosenLoan.book.title}</em></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                ¿Está seguro que quiere confirmar la devolución de este libro por parte de {props.chosenLoan.reader.first_name + " " + props.chosenLoan.reader.last_name}?
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => props.handleClose()}>No</Button>
                <Button bsStyle="primary" onClick={() => props.handleReturnConfirm()}>Sí</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmLoanReceptionModal;