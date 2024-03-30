const express = require('express');
const router = express.Router();

//require controller modules
const book_controller = require('../controllers/bookController');
const author_controller = require('../controllers/authorController');
const genre_controller = require('../controllers/genreController');
const book_instance_controller = require('../controllers/bookinstanceController');


//  BOOK ROUTES //

//GET catalog home page
router.get('/', book_controller.index);

//GET req create Book
router.get('/book/create', book_controller.book_create_get);
//POST req create Book
router.post('/book/create', book_controller.book_create_post);

//GET req delete Book
router.get('/book/:id/delete', book_controller.book_delete_get);
//Post req delete Book
router.post('/book/:id/delete', book_controller.book_delete_post);

//GET req update Book
router.get('/book/:id/update', book_controller.book_update_get);
//POST req update Book
router.post('/book/:id/update', book_controller.book_update_post);

//GET req 1 Book
router.get('/book/:id', book_controller.book_detail);
//GET req list Books
router.get('/books', book_controller.book_list);


//  AUTHOR ROUTES   //

//GET req create Author
router.get('/author/create', author_controller.author_create_get);
//POST req create Author
router.post('/author/create', author_controller.author_create_post);

//GET req delete Author
router.get('/author/:id/delete', author_controller.author_delete_get);
//POST req delete Author
router.post('/author/:id/delete', author_controller.author_delete_post);

//GET req update Author
router.get('/author/:id/update', author_controller.author_update_get);
//POST req update Author
router.post('/author/:id/update', author_controller.author_update_post);

//GET req 1 Author
router.get('/author/:id', author_controller.author_detail);
//GET req list of Authors
router.get('/authors', author_controller.author_list);



//  GENRE ROUTES    //

//GET req create Genre
router.get('/genre/create', genre_controller.genre_create_get);
//Post req create Genre
router.post('/genre/create', genre_controller.genre_create_post);

//GET req delete Genre
router.get('/genre/:id/delete', genre_controller.genre_delete_get);
//POST req delte Genre
router.post('/genre/:id/delete', genre_controller.genre_delete_post);

//GET req update Genre
router.get('/genre/:id/update', genre_controller.genre_update_get);
//POST req update Genre
router.post('/genre/:id/update', genre_controller.genre_update_post);

//GET req 1 Genre
router.get('/genre/:id', genre_controller.genre_detail);
//Get req list of Genres
router.get('/genres', genre_controller.genre_list);


//  BOOKINSTANCE ROUTES //

//GET req create Book Instance
router.get('/bookinstance/create', book_instance_controller.bookinstance_create_get);
//POST req create Book Instance
router.post('/bookinstance/create', book_instance_controller.bookinstance_create_post);

//GET req delete Book Instance
router.get('/bookinstance/:id/delete', book_instance_controller.bookinstance_delete_get);
//POST req delete book
router.post('/bookinstance/:id/delete', book_instance_controller.bookinstance_delete_post);

//GET req update Book Instance
router.get('/bookinstance/:id/update', book_instance_controller.bookinstance_update_get);
//POST req update Book Instance
router.post('/bookinstance/:id/update', book_instance_controller.bookinstance_update_post);

//GET req Book Instance
router.get('/bookinstance/:id', book_instance_controller.bookinstance_detail);
//GET req list all Book Instances
router.get('/bookinstances', book_instance_controller.bookinstance_list);

module.exports = router