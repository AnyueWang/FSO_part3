const mongoose = require('mongoose')

const argv = process.argv

if (argv.length!==3 && argv.length!==5) {
  console.log('please input a correct command: node mongo.js [password] (optional: [name] [number])')
  process.exit(1)
}

const password = argv[2]

const url =
  `mongodb+srv://anyue:${password}@phonebook.llrfe7i.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=phonebook`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (argv.length === 5) {
    const person = new Person({
        name: argv[3],
        number: argv[4]
    })
    person.save().then(result=>{
        console.log(`Person ${result.name} ${result.number} saved!`)
        mongoose.connection.close()
    })
} else {
    Person.find({}).then(result=>{
        console.log('Phonebook:')
        result.forEach(e=>console.log(`${e.name} ${e.number}`))
        mongoose.connection.close()
    })
}
