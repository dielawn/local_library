const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
    first_name: { type: String, required: true, maxLength: 100 },
    family_name: { type: String, required: true, maxLength: 100},
    date_of_birth: { type: Date },
    date_of_death: { type: Date },
});

//virtual for author's full name
AuthorSchema.virtual('name').get(function () {
    let fullName = '';
    if (this.first_name && this.family_name) {
        fullName = `${this.family_name}, ${this.first_name}`
    }

    return fullName
});

//virtual for author's URL
AuthorSchema.virtual('url').get(function () {
    return `/catalog/author/${this._id}`;
});
//lifespan
AuthorSchema.virtual('lifespan').get(function () {
    const birthDate = DateTime.fromJSDate(this.date_of_birth);
    const deathDate = DateTime.fromJSDate(this.date_of_death);
   return `${birthDate.isValid ? birthDate.toLocaleString(DateTime.DATE_MED) : 'DOB Unknown'} - ${deathDate.isValid ? deathDate.toLocaleString(DateTime.DATE_MED) : ''}`
})


module.exports = mongoose.model('Author', AuthorSchema)