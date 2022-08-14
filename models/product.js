const mongoose = require(`mongoose`)

const ProductSchema = new mongoose.Schema({
    featured: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 4.5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    name: {
        type: String,
        required: [true, "Please provide a product name"]
    },
    price: {
        type: Number,
        required: [true, "Please enter a price"]
    },
    company: {
        type: String,
        // enum limits choices to those provided in the array.
        enum: {
            values: ['ikea', 'liddy', 'caressa', 'marcos'],
            message: '{VALUE} is not valid'
        }      
    }
})

module.exports = mongoose.model('Product', ProductSchema)