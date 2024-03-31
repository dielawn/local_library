const Book = require('../models/book');
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");

const asyncHandler = require('express-async-handler');

exports.index = asyncHandler(async (req, res, next) => {
    //get details of books, book instances, authors and genre counts
    const [
        numBooks,
        numBookInstances,
        numAvailableBookInstances,
        numAuthors,
        numGenres,
    ] = await Promise.all([
        Book.countDocuments({}).exec(),
        BookInstance.countDocuments([]).exec(),
        BookInstance.countDocuments({ status: 'Available' }).exec(),
        Author.countDocuments({}).exec(),
        Genre.countDocuments({}).exec(),
    ]);
    res.render('index', {
        title: 'Local Library Home',
        book_count: numBooks,
        book_instance_count: numBookInstances,
        book_instance_count: numAvailableBookInstances,
        author_count: numAuthors,
        genre_count: numGenres,
    });
});

//create
//display Book create form on GET
exports.book_create_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Book create GET');
});

//handle Book create on POST
exports.book_create_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Book create POST');
});

//read
//display list of all Books
exports.book_list = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Book list');
});
//display detail page for a specific Book
exports.book_detail = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: Book ${req.params.id}`);
});

//update
//display Book update form on GET
exports.book_update_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Book update GET')
});
//handle Book update on POST
exports.book_update_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Book update POST');
});

//delete
//display Book delete form on GET
exports.book_delete_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Book delete GET');
});
//handle Book delete on POST
exports.book_delete_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED Book delete POST')
})