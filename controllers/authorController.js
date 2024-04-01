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
    res.render('author_form', { title: 'Create Author' });
});

//handle author create on POST
exports.author_create_post = [
    //validate and sanitize fields
    body('first_name')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('First name must be specified.')
        .isAlphanumeric()
        .withMessage('First name has non-alphnumeric characters.'),
    body('family_name')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Family name is required')
        .isAlphanumeric()
        .withMessage('Fanily name has non-alphnumeric characters.'),
    body('date_of_birth', 'Invalid date of birth')
        .optional({ values: 'falsy' })
        .isISO8601()
        .toDate(),
    body('date_of_death', 'Invalid date of death')
        .optional({ values: 'falsy' })
        .isISO8601()
        .toDate(),

    //process request after val/san
    asyncHandler(async (req, res, next) => {
        //extract errors from req
        const errors = validationResult(req);
        //author obj with escaped and trimmed data
        const author = new Author({
            first_name: req.body.first_name,
            family_name: req.body.family_name,
            date_of_birth: req.body.date_of_birth,
            date_of_death: req.body.date_of_death,
        });

        if (!errors.isEmpty()) {
            //is errors
            res.render('author_form', {
                title: 'Create Author',
                author: author,
                errors: errors.array(),
            });
            return;
        } else {
            //date from form is valid

            //save author
            await author.save();
            //redirect to new author record
            res.redirect(author.url)
        }
    }),
];

//display author delete form on GET
exports.author_delete_get = asyncHandler(async (req, res, next) => {
    //get details of author and their books in parallel
    const [author, allBooksByAuthor] = await Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({ author: req.params.id }, 'title summary').exec(),
    ]);

    if (author === null) {
        //nothing to delete return to authors list
        res.redirect('/catalog/authors');
    }

    res.render('author_delete', {
        title: 'Delete Author',
        author: author,
        author_books: allBooksByAuthor,
    });
});

//handle author delete on POST
exports.author_delete_post = asyncHandler(async (req, res, next) => {
    //details of author and all their books in parallel
    const [author, allBooksByAuthor] = await Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({ author: req.params.id }, 'title summary').exec(),
    ]);

    if (allBooksByAuthor.length > 0) {
        res.render('author_delete', {
            title: 'Delete Author',
            author: author,
            author_books: allBooksByAuthor,
        });
        return
    } else {
        //no books
        await Author.findByIdAndDelete(req.body.authorid);
        res.redirect('/catalog/authors');
    }
});

//display author update form on GET
exports.author_update_get = asyncHandler(async (req, res, next) => {
    const [author, allBooksByAuthor, allGenres] = await Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({ author: req.params.id }, 'title summary').exec(),
        Genre.find().sort({ name: 1 }).exec(),
    ]);

    if (author === null) {
        //no results
        const err = new Error('Author not found');
        err.status = 404;
        return next(err);
    }

    allGenres.forEach((genre) => {
        if (allBooksByAuthor.genre.includes(genre._id)) genre.checked = 'true';
    });

    res.render('author_form', {
        title: 'Update Author',
        author: author,
        genres: allGenres,
        author_books: allBooksByAuthor,
    });
});

//handle author update on POST
exports.author_update_post = [
    (req, res, next) => {
        if (!Array.isArray(req.body.genre)) {
            req.body.genre =
                typeof req.body.genre === 'undefined' ? [] : [req.body.genre];
        }
        next();
    },

    //san & val
    body('title', 'Title must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('author', 'Author must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('summary', 'Summary must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('isbn', 'ISBN must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('genre.*').escape(),

    //process req after  val/san
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        //create Book obj w/ escaped/trimmed data & old id
        const book = new Book({
            title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: typeof req.body.genre === 'undefined' ? [] : req.body.genre,
            _id: req.params.id, //this is required or a new id will be assigned
        });

        if (!errors.isEmpty()) {
            //is error

            //all authors and genres for form
            const [allAuthors, allGenres] = await Promise.all([
                Author.find().sort({ family_name: 1 }).exec(),
                Genre.find().sort({ name: 1 }).exec(),
            ]);

            //mark selected genres as checked
            for (const genre of allGenres) {
                if (book.genre.indexOf(genre._id) > -1) {
                    genre.checked = 'true';
                }
            }

            res.render('book_form', {
                title: 'Update Book',
                authors: allAuthors,
                genres: allGenres,
                book: book,
                errors: errors.array(),
            });
            return
        } else {
            //data from form is valid update the record
            const updatedBook = await Book.findByIdAndUpdate(req.params.id, book, {});
            //redirect to book detail page
            res.redirect(updatedBook.url);
        }
    }),
];