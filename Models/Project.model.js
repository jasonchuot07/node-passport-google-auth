const mongoose = require('mongoose');

const Schema = mongoose.Schema
const opts = { toJSON: { virtuals: true } };
const ProjectSchema = new Schema({
    name: {
        type: String,
        required: true,
    }, 
    company: {
        type: String,
        required: false,
    }, 
    slug: {
        type: String,
        required: false,
    }, 
    background: {
        type: String,
        required: true,
    }, 
    companyDes: {
        type: String,
        required: true,
    }, 
    productDes: {
        type: Date,
    }
},{
    timestamps: true
},opts)

const Project = mongoose.model('Projects', ProjectSchema)

module.exports = Project