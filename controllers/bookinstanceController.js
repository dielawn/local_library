const BookInstance = require('../models/bookinstance');
const Book = require("../models/book");


const { body, validationResult } = require("express-validator");

const asyncHandler = require('express-async-handler');

//display list of all BookInstances cRud
exports.bookinstance_list = asyncHandler(async (req, res, next) => {
    const allBookInstances = await BookInstance.find().populate('book').exec();

    res.render('bookinstance_list', {
        title: 'Book Instance List',
        bookinstance_list: allBookInstances,
    });
});

//display detail page for a specific BookInstance cRud
exports.bookinstance_detail = asyncHandler(async (req, res, next) => {
    const bookInstance = await BookInstance.findById(req.params.id)
        .populate('book')
        .exec();
    if (bookInstance === null) {
        const err = new Error('Book copy not found');
        err.status = 404;
        return next(err)
    }

    res.render('bookinstance_detail', {
        title: 'Book:',
        bookinstance: bookInstance,
    });
});

//display BookInstance create form on GET Crud
exports.bookinstance_create_get = asyncHandler(async (req, res, next) => {
    const allBooks = await Book.find({}, "title").sort({ title: 1 }).exec();
  
    res.render("bookinstance_form", {
      title: "Create BookInstance",
      book_list: allBooks,
    });
  }); 

//handle BookInstance create on POST Crud
exports.bookinstance_create_post = [
    body('book', 'Book must be specified').trim().isLength({ min: 1 }).escape(),
    body('imprint', 'Imprint must be specified')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('status').escape(),
    body('due_back', 'Invalid date')
        .optional({ values: 'falsy' })
        .isISO8601()
        .toDate(),

    //process req after val/san
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        //create BookInstance obj w/ escaped and trimmed data
        const bookInstance = new BookInstance({
            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back,
        });

        if (!errors.isEmpty()) {
            //is error
            //render form again w/ san data and error msgs
            const allBooks = await Book.find({}, 'title').sort({ title: 1 }).exec();

            res.render("bookinstance_form", {
                title: "Create BookInstance",
                book_list: allBooks,
                selected_book: bookInstance.book._id,
                errors: errors.array(),
                bookinstance: bookInstance,
              });
            return;
        } else {
            //data is valid
            await bookInstance.save();
            res.redirect(bookInstance.url);
        }
    }),
];

//display BookInstance update form on GET crUd
exports.bookinstance_update_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: BookInstance update GET');
});

//handle bookinstance update on POST crUd
exports.bookinstance_update_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: BookInstance update POST');
});

//display BookInstance delete form on GET cruD
exports.bookinstance_delete_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: BookInstance delete GET');
});

//handle BookInstance delete on POST cruD
exports.bookinstance_delete_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: BookInstance delte POST')
})