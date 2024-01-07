const mongoose = require("mongoose");
const videoSubtitleSchema = new mongoose.Schema({
  videoId: String,
  videoFile: Buffer,
  subtitlesData: String,
});
const VideoSubtitle = mongoose.model("VideoSubtitle", videoSubtitleSchema);
module.exports = VideoSubtitle;
