const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  log: [{ desc: String,
          duration: Number,
          date: String }],
  userID: String
});

let User = mongoose.model("Exercise users", userSchema);

function postNewUser(req, res, next) {
  console.log("############\n# New User:", req.body.username);
  
  // If we ever allow deletion of users, this method obviously needs to change
  User.countDocuments({})
    .then(count => {
      let ID = '0'.repeat(4 - count.toString().length) + count.toString();
      return new User({ name: req.body.username, userID: ID});
    })
    .then(newUser => newUser.save())
    .then(user => {
      console.log("New user saved: ", user.name, " ", user.userID);
      res.json({ name:user.name, ID:user.userID });
      next();
    });
}

function getAllUsers(req, res, next) {
  
}

function postNewExercise(req, res, next) {
  console.log("####################\n# New exercise log:", req.body);
  /*  Form elements:
      name="userId" placeholder="userId*">
      name="description" placeholder="description*">
      name="duration" placeholder="duration* (mins.)">
      name="date" placeholder="date (yyyy-mm-dd)">
  */
  // Store date as a string in the DB
  let date = new Date(req.body.date);
  date = (isNaN(date.getTime()) ? new Date() : date).toDateString();
  let log = { desc: req.body.description,
              duration: parseInt(req.body.description),
              date: date };
  // Should really validate before submitting form...
  if(isNaN(log.duration)) { log.duration = 0; }
  User.findOneAndUpdate({ userID: req.body.userID }, { log: log }, { new: true })
    .then(user => {
      console.log("Log element pushed:", user.log);
      res.json(user);
    })
    .catch(err => {
      console.log(err);
      res.json(err)
    });
}

function getExerciseLog(req, res, next) {
  
}



module.exports = { postNewUser: postNewUser,
                   getAllUsers: getAllUsers,
                   postNewExercise: postNewExercise,
                   getExerciseLog: getExerciseLog
                 };