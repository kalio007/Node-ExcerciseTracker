const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')

const { default: mongoose } = require('mongoose')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

let excerciseSessionSchema = new mongoose.Schema({
  description: {type:String, required: true},
  duration: { type: Number, required: true},
  date: String
})

let userSchema = new mongoose.Schema({
  username: {type:String, required:true},
  log: {excerciseSessionSchema}
})
let Session = mongoose.model('Session', excerciseSessionSchema)
let user = mongoose.model('user', userSchema)

app.post('/api/users',bodyParser.urlencoded({ extended: false }), function ( req, res ){
  res.json({})
  console.log(req.body)
} )






const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
