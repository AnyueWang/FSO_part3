const express = require("express")
const app = express()
const morgan = require('morgan')

app.use(express.json())

morgan.token('content', (req,res)=>JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const time = Date()
    const num = persons.length
    const infoStr = `Phonebook has info for ${num} ${num > 1 ? 'people' : 'person'}`

    res.send(`<p>${infoStr}</p><p>${time}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(e => e.id === id)

    if (!!person) {
        res.send(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(e => e.id === id)

    if (!!person) {
        persons = persons.filter(e => e.id !== id)
        res.status(204).end()
    } else {
        res.status(404).end()
    }
})

app.post('/api/persons', (req, res) => {
    const bigNum = 100000000
    const id = Math.floor(Math.random() * bigNum)
    const info = req.body

    if (!info.name || !info.number) {
        return res.status(400).json({
            error: "Name or number is missing"
        })
    }

    if (persons.some(e => e.name === info.name)) {
        return res.status(400).json({ 
            error: "Name must be unique" 
        })
    }

    const person = {
        "id": id,
        "name": info.name,
        "number": info.number
    }
    persons = persons.concat(person)
    res.json(person)

})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})