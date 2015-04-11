// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var UserSchema   = new mongoose.Schema({


  email: { type: String, default: "" },
  name:{ type: String, default:"" },
  pendingTasks: { type: [String], index: true,default:[] },
  dateCreated:{ type: Date, default: Date.now }
});



// Export the Mongoose model

module.exports = mongoose.model('User', UserSchema);
