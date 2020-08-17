var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Post = new Schema(
    {
        author: { type: String, required: true },
        email: { type: String, required: true },
        festival: { type: Schema.Types.ObjectId, ref: 'Festival', required: true },
        date: { type: Date, default: Date.now, required: true },
        image: { type: String },
        comment: { type: String, required: true }
    }
)

Post.set('toObject', { getters: true })

module.exports = mongoose.model('Post', Post)
