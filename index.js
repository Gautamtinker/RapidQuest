const express = require("express");
const multer = require("multer");
const connect = require("./model/db");
const cors = require("cors");
const uploadVideoAndSubtitles = require("./route/vedioRoute");

const app = express();
const port = process.env.PORT || 3001;
app.use(express.json());
app.use(cors());
connect();
app.use("/", uploadVideoAndSubtitles);

// Define MongoDB schema

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
