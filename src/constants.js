export const BASE_URL = 'http://localhost:8000/';
export const ISBN_URL = 'https://www.googleapis.com/books/v1/volumes?q=isbn:';
export const LIBRARY_NAME = 'BibliOsa';
export const EMAIL_REGEX = new RegExp('^[a-z0-9](.?[a-z0-9]){5,}@g(oogle)?mail.com$');
export const DEFAULT_BOOK_COVER_URL = 'https://d1uyjdd2vmpgct.cloudfront.net/public/defaults/default-book-cover.png';
export const NUMBERS_REGEX = /^[0-9\b]+$/;
export const WRITING_ISBN_10_REGEX = /^[0-9]{0,10}X?$/;
export const WRITING_ISBN_13_REGEX = /^[0-9]{0,13}X?$/;