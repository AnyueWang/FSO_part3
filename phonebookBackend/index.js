require('dotenv').config()
const express = require("express")
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

morgan.token('content', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

app.get('/api/persons', (req, res) => {
    Person.find({}).then(result => {
        res.json(result)
    })
})

app.get('/info', (req, res) => {
    Person.find({}).then(result => {
        const time = Date()
        const num = result.length
        const infoStr = `Phonebook has info for ${num} ${num > 1 ? 'people' : 'person'}`
        res.send(`<p>${infoStr}</p><p>${time}</p>`)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(result => {
        if (result) {
            res.send(result)
        } else {
            res.status(404).end()
        }
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(result => {
            if (result) {
                res.status(204).end()
            } else {
                res.status(404).end()
            }
        }).catch(error => {
            next(error)
        })
})

app.put('/api/persons/:id', (req, res, next) => {
    const updatedPerson = {
        name: req.body.name,
        number: req.body.number
    }
    Person.findByIdAndUpdate(req.params.id, updatedPerson, { new: true })
        .then(result => {
            if (result) {
                res.json(result)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.post('/api/persons', (req, res) => {
    const info = req.body

    if (!info.name) {
        return res.status(400).json({
            error: "Name or number is missing"
        })
    }
    Person.find({ name: info.name }).then(result => {
        if (result.length) {
            return res.status(400).json({
                error: "Name must be unique"
            })
        } else {
            const person = new Person({
                "name": info.name,
                "number": info.number
            })
            person.save().then(result => {
                res.json(result)
            })
        }
    })
})

const errorHandler = (error, req, res, next) => {
    console.log(error.message)
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})