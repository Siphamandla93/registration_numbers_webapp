var mongoose = require('mongoose');
module.exports = function(MongoUrl){
mongoose.connect(MongoUrl);
mongoose.Promise = global.Promise

  var UserSchema = mongoose.Schema({
    name:String,
  });

UserSchema.index({name:1}, {unique:true});
  var User = mongoose.model('User', UserSchema);

return {User}
};
// {unique:true}
