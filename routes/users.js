var mongoose = require('mongoose');
var plm = require('passport-local-mongoose');

mongoose.connect('mongodb://localhost/frnd',{useNewUrlParser:true},{useUnifiedTopology:true});

var userSchema = mongoose.Schema({
  username:String,
  name:String,
  password:String,
  frnds:[{
    type:String
  }]
})

userSchema.plugin(plm);

module.exports = mongoose.model('users',userSchema);