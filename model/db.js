const mongoose = require("mongoose");
const connect = async () => {
  const response = await mongoose.connect(
    "mongodb+srv://gautamtinker83:v06gW5uzG1KS6Hse@cluster0.p9ukimr.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  console.log("db connected");
};
module.exports = connect;
