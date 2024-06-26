const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GenreSchema = new Schema({
    name: { 
        type: String, 
        required: true, 
        minLength: 3, 
        maxLength: 100,
        // enum: ['Fiction', 'Non-Fiction', 'Romance', 'History', 'Science-Fiction', 'Fantasy', 'Mystery', 'Thriller', 'Horror', 'Biography/Autobiography', 'Self-Help', 'Science', 'Travel', 'True Crime', 'Cookbooks'],
    },    
});

//virtual for genre's URL
GenreSchema.virtual('url').get(function () {
    return `/catalog/genre/${this._id}`;
});

module.exports = mongoose.model('Genre', GenreSchema);
