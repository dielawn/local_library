const Author = require('../models/author');
const Book = require("../models/book");

const { body, validationResult } = require("express-validator");

const asyncHandler = require('express-async-handler');

//display list of all authors
exports.author_list = asyncHandler(async (req, res, next) => {
    const allAuthors = await Author.find().sort({ family_name: 1 }).exec();
    res.render('author_list', {
        title: 'Author List',
        author_list: allAuthors,
    });
});

//display detail page for a specific author
exports.author_detail = asyncHandler(async (req, res, next) => {
    const [author, allBooksByAuthor] = await Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({ author: req.params.id }, 'title summary').exec(),
    ]);

    if (author === null) {
        const err = new Error('Author not found');
        err.status = 404;
        return next(err);
    }

    res.render('author_detail', {
        title: 'Author Detail',
        author: author,
        author_books: allBooksByAuthor,
    });
});

//display author create form on GET
exports.author_create_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Author create GET');
});

//handle author create on POST
exports.author_create_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Author create POST');
});

//display author delete form on GET
exports.author_delete_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Author delete GET');
});

//handle author delete on POST
exports.author_delete_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Author delte POST');
});

//display author update form on GET
exports.author_update_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Author update GET');
});

//handle author update on POST
exports.author_update_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Author update POST');
});