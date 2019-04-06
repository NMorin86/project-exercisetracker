const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  log: [{ desc: String,
          duration: Number,
          date: Date }]
});

let User = mongoose.model("Exercise users", userSchema);

function postNewUser(req, res, next) {
  console.log("############\n# New User:", req.body.username);
  let newUser = new User({ name: req.body.username });
  newUser.save()
    .then(user => {
      console.log("New user saved: ", user);
      res.json(user);
      next();
    });
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