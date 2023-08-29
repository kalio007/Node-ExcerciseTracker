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

app.post('/api/users', bodyParser.urlencoded({ extended: false }), function ( req, res ){
  res.json({
    username: req.body.username
  })

  //work on the Mongodb part
  let newUser = new user({username: req.body.username})
  newUser.save((error,savedUser) => {
    if (!error){
      let reqObject ={}
        resObject['username'] = savedUser.username
        resObject['id'] = savedUser.id
        res.json(resObject)
    }
  })
  console.log(req.body)
} )

app.post('/api/users/add',bodyParser.urlencoded({ extended: false }), function ( req, res ){
  let newSession  = new Session({
    description: req.body.description,
    duration: parseInt(req.body.duration),
    date: req.body.date
  })
  if (newSession.date === ''){
    newSession.date = new Date().toISOString().substring(0, 10)
  }
  user.findByIdAndUpdate(
    req.body.userId,
    {$push:{log: new Session}},
    {new: true},
    (error, updatedUser) => {
      let resObject = {}
      resObject['id'] = updatedUser.id
      resObject['username'] = updatedUser.username
      resObject['date'] = new Date(newSession.date).toUTCString()
      resObject['description'] = newSession.description
      resObject['duration'] = newSession.duration
      res.json(resObject);
    }
  )
} )

app.get('/api/excercise/log', function (req, res ) {
  console.log(req.query)
  user.findById(req.query.userId, (error, result) => {
    if (!error){
      let resObject = result
      resObject['count'] = result.log.length
      res.json(resObject)

    }
  })
  res.json({})
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
