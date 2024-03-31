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
    const [allAuthors, allGenres] = await Promise.all([
        Author.find().sort({ family_name: 1 }).exec(),
        Genre.find().sort({ name: 1 }).exec(),
    ]);

    res.render('book_form', {
        title: 'Create Book',
        authors: allAuthors,
        genres: allGenres,
    });
});

//handle Book create on POST
exports.book_create_post = [
    //convert genre to an array
    (req, res, next) => {
        if (!Array.isArray(req.body.genre)) {
            req.body.genre =
              typeof req.body.genre === 'undefined' ? [] : [req.body.genre];
        }
        next();
    },

    //sanitize & validate
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
    body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1 }).escape(),
    body('genre.*').escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        //create bood object with escaped and trimmed data
        const book = new Book({
            title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: req.body.genre,
        });


        if (!errors.isEmpty()) {
            res.render('book_form', {
                title: 'Create Book',
                authors: allAuthors,
                genres: allGenres,
            })

            const [allAuthors, allGenres] = await Promise.all([
                Author.find().sort({ family_name: 1 }).exec(),
                Genre.find().sort({ name: 1 }).exec(),
            ]);

            //mark our selected geres as checked
            for(const genre of allGenres) {
                if (book.genre.includes(genre._id)) {
                    genre.checked = 'true';
                }
            }
            res.render('book_form', {
                title: 'Create Book',
                authors: allAuthors,
                genres: allGenres,
                book: book,
                errors: errors.array(),
            });
        } else {
            //data from form is valid
            await book.save()
            res.redirect(book.url);
        }        
    }),
];

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
    const [book, allAuthors, allGenres] = await Promise.all([
        Book.findById(req.params.id).populate('author').exec(),
        Author.find().sort({ family_name: 1 }).exec(),
        Genre.find().sort({ name: 1 }).exec(),
    ]);

    if (book === null) {
        //no results
        const err = new Error('Book not found');
        err.status = 404;
        return next(err);
    }

    //mark selected genres as checked
    allGenres.forEach((genre) => {
        if (book.genre.includes(genre._id)) genre.checked = 'true';
    });

    res.render('book_form', {
        title: 'Update Book',
        authors: allAuthors,
        genres: allGenres,
        book: book,
    });
});
//handle Book update on POST
exports.book_update_post = [
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

//delete
//display Book delete form on GET
exports.book_delete_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Book delete GET');
});
//handle Book delete on POST
exports.book_delete_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED Book delete POST')
})