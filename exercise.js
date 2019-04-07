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
      res.json({ name: user.name, ID: user.userID });
    
    });
}

function getAllUsers(req, res, next) {
  console.log("In getAllUsers");
  
  User.find({}, 'name userID').exec()
    
    .then(data => {
      console.log("Return data:" + data.length + " records");
      res.send(data.map((d) => d.name + " " + d.userID).join('<br>'));
    })
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
  date = (isNaN(date.getTime()) ? new Date() : date).toISOString();
  let log = { desc: req.body.description,
              duration: parseInt(req.body.duration),
              date: date };
  // Should really validate this BEFORE allowing form submission
  if(isNaN(log.duration)) { log.duration = 0; }
  
  console.log("Executing search:", req.body.userId, log);
  User.findOneAndUpdate({ userID: req.body.userId }, { $push: { log: log }}, { new: true }).exec()
  
    .then(user => {
      console.log("Log element pushed:", user.log.map((val) => val.date));
      //res.json(user);
      res.send(quickFormat(user));
    })
    
    .catch(err => {
      console.log(err);
      res.send(err.toString())
    });
}

function getExerciseLog(req, res, next) {
  console.log("In getExerciseLog:", req.query);
  
  User.findOne({ userID: req.query.userID }).exec()
    
  .then(user => {
    if(user.log.length === 0) {
      return Promise.reject("No log entries found for user: " + user.userID);
    }
    
    // De-mongoosify and sort the log array
    let log = [];
    user.log.forEach(v => log.push({ desc: v.desc, duration: v.duration, date: v.date }));
    log.sort((a,b) => Date.parse(a.date) - Date.parse(b.date));
    console.log("Prepping logs for user:", user.userID);
   
    // Reject results before 'from' date
    if(req.query.from !== '') {
      let from = new Date(req.query.from);
      console.log("Culling dates before ", from);
      if(!isNaN(from.getTime())) {
         // 'from' date is valid
         log = log.filter(val => Date.parse(val.date) >= from.getTime());
      }
    }
   
    // Reject results after 'to' date    
    if(req.query.to !== '') {
      let to = new Date(req.query.to);
      console.log("Culling dates after ", to);
      if(!isNaN(to.getTime())) {
         // 'to' date is valid
         log = log.filter(val => Date.parse(val.date) <= to.getTime());
      }
    }

    // Truncate log
    let limit = parseInt(req.query.limit);
    if(limit !== '' && !isNaN(limit) && limit < log.length) {
      log = log.slice(0, limit);
    }
    
    let total = log.reduce((t, v) =>  t + v.duration, 0);
    
    let output = { userID: user.userID, total: total, logs: log };
    console.log("Preparing output log:", output);
    res.send(quickFormat(output));
  })
  .catch(err => {
    console.log(err);
    res.send(err);
  });
}
    

function quickFormat(obj) {
  return JSON.stringify(obj).split(',').join('<br>');
}
                                       

module.exports = { postNewUser: postNewUser,
                   getAllUsers: getAllUsers,
                   postNewExercise: postNewExercise,
                   getExerciseLog: getExerciseLog,
                 };