const mongoose = require('mongoose');

const Schema = mongoose.Schema
const opts = { toJSON: { virtuals: true } };
const NewsSchema = new Schema({
    title: {
        type: String,
        required: true,
    }, 
    slug: {
        type: String,
        required: false,
    }, 
    background: {
        type: String,
        required: false,
    }, 
    short: {
        type: String,
        required: true,
    }, 
    content: {
        type: String,
        required: true,
    }, 
    createdAt: {
        type: Date,
    }
},{
    timestamps: true
},opts)

const News = mongoose.model('News', NewsSchema)

module.exports = News