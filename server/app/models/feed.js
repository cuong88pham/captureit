var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var FeedSchema = new Schema({
  title: {type: String, index: {unique: true, required : true, dropDups: true}},
  url: String,
  content: {type: Array, default: []},
  description: String,
  domain: String,
  local_path: String,
  image: String,
  hashtag: Array,
  user_like_ids: Array,
  like_count: {type: Number, default: 0},
  user_ids: {type: Array, default: []},
  created_at: { type: Date, default: Date.now }
});

mongoose.model('Feed', FeedSchema);

