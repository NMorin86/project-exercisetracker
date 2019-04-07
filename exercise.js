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
  
  // If we ever allow deletion of users, this ID needs to change
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
  // If date is not valid then use today
  date = (isNaN(date.getTime()) ? new Date() : date).toDateString();
  let log = { desc: req.body.description,
              duration: parseInt(req.body.duration),
              date: date };
  // Should really validate this BEFORE allowing form submission
  if(isNaN(log.duration)) { log.duration = 0; }
  
  console.log("Executing search:", req.body.userId, log);
  User.findOneAndUpdate({ userID: req.body.userId }, { $push: { log: log }}, { new: true }).exec()
  
    .then(user => {
      console.log("Log element pushed:", user.log.map((val) => val.date));
      res.json(user);
    })
    
    .catch(err => {
      console.log(err);
      res.send(err)
    });
}

function getExerciseLog(req, res, next) {
  
}



module.exports = { postNewUser: postNewUser,
                   getAllUsers: getAllUsers,
                   postNewExercise: postNewExercise,
                   getExerciseLog: getExerciseLog
                 };