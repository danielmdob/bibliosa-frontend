import React from 'react';
import AddBookForm from './AddBookForm';
import SetBookComponent from './SetBookComponent';

import '../assets/css/ManualAdd.css';

class ManualAdd extends SetBookComponent {

    renderAddBookForm() {
        let newState = Object.assign({}, this.state);

        return (
            <AddBookForm parentState={newState} handleTitleChange={(titleInput) =>this.handleTitleChange(titleInput)}
                         handleIssnChange={(issnInput) =>this.handleIssnChange(issnInput)}
                         handleCallNumberChange={(callNumberInput) =>this.handleCallNumberChange(callNumberInput)}
                         handlePublisherChange={(publisherInput) =>this.handlePublisherChange(publisherInput)}
                         handleYearChange={(yearInput) => this.handleYearChange(yearInput)}
                         handleCopiesChange={(copiesInput) => this.handleCopiesChange(copiesInput)}
                         handleIsbn10Change={(isbn10Input) => this.handleIsbn10Change(isbn10Input)}
                         handleIsbn13Change={(isbn13Input) => this.handleIsbn13Change(isbn13Input)}
                         handleEditionChange={(editionInput) => this.handleEditionChange(editionInput)}
                         handleBookCoverUrlChange={(urlInput) => this.handleBookCoverUrlChange(urlInput)}
                         handleAuthorsChange={(selected) => this.handleAuthorsChange(selected)}
                         handleSubmit={(form) => this.handleSubmit(form)}
                         renderStatusAlert={() => this.renderStatusAlert()}
                         onCategorySelect={(category) => this.onCategorySelect(category)}
                         title="Agregar libro"
            />
        );
    }

    render() {
        return (
            this.renderAddBookForm()
        );
    }
}

export default ManualAdd;