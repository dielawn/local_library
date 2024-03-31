const Genre = require('../models/genre');
const Book = require("../models/book");


const asyncHandler = require('express-async-handler');

//display list of all Genre
exports.genre_list = asyncHandler(async (req, res, next) => {
    const allGenres = await Genre.find().sort({ name: 1 }).exec();
    res.render('genre_list', { title: 'Genre List', genre_list: allGenres });
});

//display detail page for a specific Genre
exports.genre_detail = asyncHandler(async (req, res, next) => {
    const [genre, booksInGenre] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Book.find({ genre: req.params.id }, 'title summary'). exec(),
    ]);
    if (genre === null) {
        const err = new Error('Genre not found');
        err.status = 404;
        return next(err);
    }

    res.render('genre_detail', {
        title: 'Genre Detail',
        genre: genre,
        genre_books: booksInGenre,
    });
});

//display Genre create form on GET
exports.genre_create_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Genre create GET');
});

//handle Genre create on POST
exports.genre_create_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Genre create POST');
});

//display Genre delete form on GET
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Genre delte GET');
});

//handle Genre delete on POST
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Genre delete POST');
});

//display genre update form on GET
exports.genre_update_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Genre update GET');
});

//handle Genre update on POST
exports.genre_update_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Genre update POST');
});