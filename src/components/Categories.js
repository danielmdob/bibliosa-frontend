import React, {Component} from 'react'
import {
    Grid,
    Row,
    Col,
    ListGroup,
    ListGroupItem,
    Form,
    FormGroup,
    FormControl,
    Button,
    Alert,
    Modal, ControlLabel
} from 'react-bootstrap';

import CategoryService from '../services/category_service';

import "../assets/css/Categories.css";

class Categories extends Component {

    constructor(props) {
        super(props);

        this.state = {
            categories: [],
            categoryName: '',
            showAlert: false,
            showDeleteModal: false,
            showEditModal: false,
            categoryToDelete: {name: '', id: -1},
            categoryToEdit: {name: '', id: -1},
            futureName: '',
        };
        this.loadCategories();

    }

    loadCategories() {
        let newState = Object.assign({}, this.state);
        CategoryService.getCategories().then(responseCategories => {
            newState.categories = responseCategories;
            this.setState({categories: responseCategories});
        });
    }

    handleChange(inputData) {
        let newState = Object.assign({}, this.state);
        newState.categoryName = inputData.target.value;
        this.setState(newState);
    }

    handleAdd(form) {
        let newState = Object.assign({}, this.state);
        form.preventDefault(); // stops the page from reloading
        CategoryService.createCategory(this.state.categoryName)
            .then(() => {
                this.loadCategories();
                newState.showAlert = false;
                this.setState(newState);
            })
            .catch(error => {
                newState.showAlert = true;
                this.setState(newState);
            })

    }

    handleDismiss() {
        let newState = Object.assign({}, this.state);
        newState.showAlert = false;
        this.setState(newState);
    }

    handleDeleteStart(category) {
        let newState = Object.assign({}, this.state);
        newState.showDeleteModal = true;
        newState.categoryToDelete = category;
        this.setState(newState);
    }

    handleDeleteConfirm() {
        CategoryService.deleteCategory(this.state.categoryToDelete.id)
            .then(() => {
                this.handleClose();
                this.loadCategories();
            });
    }

    handleEditStart(category) {
        let newState = Object.assign({}, this.state);
        newState.showEditModal = true;
        newState.categoryToEdit = category;
        newState.futureName = category.name;
        this.setState(newState);
    }

    handleClose() {
        let newState = Object.assign({}, this.state);
        newState.showDeleteModal = false;
        newState.showEditModal = false;
        this.setState(newState);
    }

    handleEditChange(inputData) {
        let newState = Object.assign({}, this.state);
        newState.futureName = inputData.target.value;
        this.setState(newState);
    }

    handleEditConfirm(form) {
        let newState = Object.assign({}, this.state);
        form.preventDefault(); // stops the page from reloading
        CategoryService.editCategory(this.state.categoryToEdit.id, this.state.futureName)
            .then(() => {
                this.loadCategories();
                newState.showAlert = false;
                this.setState(newState);
            })
            .catch(error => {
                newState.showAlert = true;
                this.setState(newState);
            })
            .then(() => this.handleClose())
    }

    renderCategories() {
        let renderedCategories = [];
        let key = 0;
        for (let category of this.state.categories) {
            renderedCategories.push(
                <ListGroupItem key={key}>
                    <Row>
                        <Col xs={8}>
                            {category.name}
                        </Col>
                        <Col xs={4} className="hidden-xs">
                            <span className="pull-right">
                            <Button bsSize="xsmall" className="edit-button" bsStyle="primary" onClick={() => this.handleEditStart(category)}>
                                <i className="far fa-edit" />
                            </Button>
                            <Button bsSize="xsmall" bsStyle="primary" onClick={() => this.handleDeleteStart(category)}>
                                <i className="far fa-trash-alt" />
                            </Button>
                            </span>
                        </Col>
                    </Row>
                </ListGroupItem>
            );
            key++;
        }
        return renderedCategories;
    }

    renderAlert() {
        if (this.state.showAlert) {
            return (
                <Row>
                    <Col sm={6}>
                        <Alert bsStyle="warning">
                            Ya existe una categoría con ese nombre
                            <p><Button onClick={() => this.handleDismiss()}>Ok</Button></p>
                        </Alert>
                    </Col>
                </Row>
            );
        }
    }

    renderDeleteModal() {
        return (
            <Modal show={this.state.showDeleteModal} onHide={() => this.handleClose()}>
                <Modal.Header closeButton>
                    <Modal.Title>Borrar Categoría</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>¿Quiere borrar la categoría {this.state.categoryToDelete.name}?</p>
                    <p>Esto hará que todos los libros de esa categoría queden sin una.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => this.handleClose()}>No</Button>
                    <Button onClick={() => this.handleDeleteConfirm()} bsStyle="primary">Sí</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    renderEditModal() {
        return (
            <Modal show={this.state.showEditModal} onHide={() => this.handleClose()}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Categoría: {this.state.categoryToEdit.name}</Modal.Title>
                </Modal.Header>
                <Form inline onSubmit={form => this.handleEditConfirm(form)}>
                    <Modal.Body>
                        <ControlLabel>Nuevo nombre </ControlLabel>{' '}
                        <FormGroup controlId="formInlineName">
                            <FormControl type="text" placeholder="Nueva Categoría"
                                         value={this.state.futureName}
                                         onChange={input => this.handleEditChange(input)} />
                        </FormGroup>{' '}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => this.handleClose()}>Cancelar</Button>
                        <Button bsStyle="primary"
                                disabled={this.state.futureName.length === 0} type="submit">Confirmar</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        );
    }

    render() {
        return (
            <Grid>
                <Row>
                    <Col xs={12}>
                        <h3>Categorías</h3>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <ListGroup>
                            {this.renderCategories()}
                            <ListGroupItem key={10000000}>
                                <Form inline onSubmit={form => this.handleAdd(form)}>
                                    <FormGroup controlId="formInlineName">
                                        <FormControl type="text" placeholder="Nueva Categoría"
                                                     value={this.state.categoryName}
                                                     onChange={input => this.handleChange(input)} />
                                    </FormGroup>{' '}
                                    <Button type="submit" bsStyle="primary"
                                            disabled={this.state.categoryName.length === 0}
                                    >
                                        Crear
                                    </Button>
                                </Form>
                            </ListGroupItem>
                        </ListGroup>
                    </Col>
                </Row>
                {this.renderAlert()}
                {this.renderDeleteModal()}
                {this.renderEditModal()}
            </Grid>
        );
    }
}

export default Categories;