// routes/videoRoutes.js

const express = require("express");
const multer = require("multer");
const {
  uploadVideoAndSubtitles,
  getVideoAndSubtitles,
} = require("../Controller/vedioController"); // Adjust the path based on your file structure

const router = express.Router();
const storage = multer.memoryStorage(); // Use memory storage for buffers
const upload = multer({ storage: storage });

router.post(
  "/uploadVideoAndSubtitles",
  upload.fields([{ name: "video" }, { name: "subtitles" }]),
  uploadVideoAndSubtitles
);
router.get("/getVideoAndSubtitles/:videoId", getVideoAndSubtitles);

module.exports = router;
