const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)
    .then(result => {
        console.log('Connected to MongoDB successfully')
    }).catch(error => {
        console.log('Error connecting to MongoDB', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [3, `Name '{VALUE}' is shorter than the minimum allowed length (3)`],
        required: true
    },
    number: {
        type: String,
        validate: {
            validator: v => {
                return /^\d{1,}-\d{1,}$/.test(v)
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'User phone number required'],
        minLength: [9, 'Number {VALUE} is shorter than the minimum allowed length (8)']
    }
})
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
module.exports = mongoose.model('Person', personSchema)