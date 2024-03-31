const BookInstance = require('../models/bookinstance');

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
    res.send('NOT IMPLEMENTED: BookInstance create GET');
});

//handle BookInstance create on POST Crud
exports.bookinstance_create_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: BookInstance create POST');
});

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