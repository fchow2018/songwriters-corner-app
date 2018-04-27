var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  song_title: String,
  genre: String,
  lyrics: String,
  // user: {type: mongoose.Schema.Types.ObjectId, ref:"User",},
});

var Post = mongoose.model("Post", PostSchema);

module.exports = Post;
