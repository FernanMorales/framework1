"use strict";

var mongoose = require('mongoose');

var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
  // Create your schemas and models here.
});

mongoose.connect('mongodb://localhost/test');

//User schema
var userSchema = new mongoose.Schema({
    username : { type : String, required : true, unique : true },
    password : { type : String, required : true }
});

// Bcrypt middleware on userSchema
userSchema.pre('save', function(next) {
    
});