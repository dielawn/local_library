const Genre = require('../models/genre');
const Book = require("../models/book");

const { body, validationResult } = require("express-validator");

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
    res.render('genre_form', { title: 'Create Genre'});
});

//handle Genre create on POST
exports.genre_create_post = [
    //validate and sanitize the name field
    body('name', 'Genre name must contain at least 3 characters')
        .trim()//removes trailing/leading whitespace
        .isLength({ min: 3 })
        .escape(),
    
    //process request after validation and sanitization
    asyncHandler(async (req, res, next) => {
        //extract validation errors from req
        const errors = validationResult(req);
        //create genre object w/ escaped and trimmed data
        const genre = new Genre({ name: req.body.name });

        if (!errors.isEmpty()) { 
            //is errors
            res.render('genre_form', {
                title: 'Create Genre',
                genre: genre,
                errors: errors.array(),
            });
            return;
        } else {
            //is valid
            const genreExists = await Genre.findOne({ name: req.body.name })
            .collation({ locale: 'en', strength: 2 })
            .exec();

            if (genreExists) {
                res.redirect(genreExists.url);
            } else {
                await genre.save();
                res.redirect(genre.url);
            }
        }
    }),
];

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