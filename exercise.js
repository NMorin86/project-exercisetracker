const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  log: [{ desc: String,
          duration: Number,
          date: Date }]
});

let User = mongoose.model("Exercise users", userSchema);

function postNewUser(err, req, res, next) {
  
}

function getAllUsers(err, req, res, next) {
  
}

function postNewExercise(err, req, res, next) {
  
}

function getExerciseLog(err, req, res, next) {
  
}



module.exports = { postNewUser: postNewUser,
                   getAllUsers: getAllUsers,
                   postNewExercise: postNewExercise,
                   getExerciseLog: getExerciseLog
                 };