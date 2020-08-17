var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Festival = new Schema(
    {
        name: { type: String, required: true },
        genre: [{ type: Schema.Types.ObjectId, ref: 'Genre', required: true }],
        description: { type: String },
        date: { type: Date, default: Date.now, required: true },
        address: { type: String },
        location: {
            lat: { type: Number },
            lng: { type: Number }
        },
        image: { type: String }
    }
)

Festival.index({ name: 'text', description: 'text', address: 'text' })
Festival.set('toObject', { getters: true })

module.exports = mongoose.model('Festival', Festival)
