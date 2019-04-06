const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const ex = require('./exercise.js');

const cors = require('cors')

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})


// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})
*/

//    I can create a user by posting form data username to /api/exercise/new-user 
//    and returned will be an object with username and _id.
app.post('/api/exercise/new-user', ex.postNewUser);

//    I can get an array of all users by getting api/exercise/users with the same 
//    info as when creating a user.
app.get('/api/exercise/users', ex.getAllUsers);

//    I can add an exercise to any user by posting form data userId(_id), 
//    description, duration, and optionally date to /api/exercise/add. If no date 
//    supplied it will use current date. Returned will the the user object with 
//    also with the exercise fields added.
app.post('/api/exercise/add', ex.postNewExercise);

//    I can retrieve a full exercise log of any user by getting /api/exercise/log 
//    with a parameter of userId(_id). Return will be the user object with added 
//    array log and count (total exercise count).
app.get('/api/exercise/log', ex.getExerciseLog);

//    I can retrieve part of the log of any user by also passing along optional 
//    parameters of from & to or limit. (Date format yyyy-mm-dd, limit = int)

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
