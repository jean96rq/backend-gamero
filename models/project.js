var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var ProjectSchema = Schema({
    name: String,
    description: String,
    category: String,
    technologies: String,
    year: Number,
    image: String,
    link: String
})

module.exports = mongoose.model('Project', ProjectSchema);