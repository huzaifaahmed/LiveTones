var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Genre = new Schema(
    {
        name: { type: String, required: true }
    }
)

Genre.set('toObject', { getters: true })

module.exports = mongoose.model('Genre', Genre)
