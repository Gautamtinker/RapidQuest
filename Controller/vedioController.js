const VideoSubtitle = require("../model/videoschema"); // Adjust the path based on your file structure

const uploadVideoAndSubtitles = async (req, res) => {
  try {
    console.log(req);
    const videoFile = req.body.video;
    const subtitlesFile = req.files["subtitles"];
    const videoId = `video_${Date.now()}`;

    // Save video and subtitles data to MongoDB
    const videoSubtitle = new VideoSubtitle({
      videoId,
      videoFile: videoFile,
      subtitlesData: subtitlesFile.toString("utf-8"),
    });
    await videoSubtitle.save();

    res.status(201).json({
      success: true,
      message: "Video and subtitles uploaded successfully",
      videoId,
    });
  } catch (error) {
    console.error("Error uploading video and subtitles:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading video and subtitles",
    });
  }
};
const getVideoAndSubtitles = async (req, res) => {
  try {
    const videoId = req.params.videoId;

    // Retrieve video and subtitles data from MongoDB
    const videoSubtitle = await VideoSubtitle.findOne({ videoId });
    if (!videoSubtitle) {
      return res.status(404).json({
        success: false,
        message: "Video and subtitles not found",
      });
    }

    res.status(201).json({
      success: true,
      videoFile: videoSubtitle.videoFile,
      subtitles: JSON.parse(videoSubtitle.subtitlesData),
    });
  } catch (error) {
    console.error("Error getting video and subtitles:", error);
    res
      .status(500)
      .json({ success: false, message: "Error getting video and subtitles" });
  }
};

module.exports = {
  uploadVideoAndSubtitles,
  getVideoAndSubtitles,
};
