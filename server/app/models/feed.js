var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var FeedSchema = new Schema({
  title: String,
  url: String,
  content: String,
  description: String,
  domain: String,
  image: String,
  hashtag: Array,
  user_like_ids: Array,
  like_count: {type: Number, default: 0},
  created_at: { type: Date, default: Date.now }
});

mongoose.model('Feed', FeedSchema);

