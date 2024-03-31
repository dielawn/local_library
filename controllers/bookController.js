const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");

const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  // Get details of books, book instances, authors and genre counts (in parallel)
  const [
    numBooks,
    numBookInstances,
    numAvailableBookInstances,
    numAuthors,
    numGenres,
  ] = await Promise.all([
    Book.countDocuments({}).exec(),
    BookInstance.countDocuments({}).exec(),
    BookInstance.countDocuments({ status: "Available" }).exec(),
    Author.countDocuments({}).exec(),
    Genre.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Local Library Home",
    book_count: numBooks,
    book_instance_count: numBookInstances,
    book_instance_available_count: numAvailableBookInstances,
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
    const allBooks = await Book.find({}, 'title author')
    .sort({title: 1})
    .populate('author')
    .exec();

    res.render('book_list', { title: 'Book List', book_list: allBooks });
});
//display detail page for a specific Book
exports.book_detail = asyncHandler(async (req, res, next) => {
    const [book, bookInstances] = await Promise.all([
        Book.findById(req.params.id).populate('author').populate('genre').exec(),
        BookInstance.find({ book: req.params.id }).exec(),
    ]);

    if (book === null) {
        const err = new Error('Book not found');
        err.status = 404;
        return new(err);
    }

    res.render('book_detail', {
        title: book.title,
        book: book,
        book_instances: bookInstances,
    });
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