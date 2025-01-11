const mongoose = require("mongoose");
const DB =
  "mongodb+srv://jitendra_12:jitendra@cluster0.83h76ye.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.set("strictQuery", true);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, 
  })
  .catch(() => {
    console.log("connected  not");
  })
  .then((app_login) => {
    console.log(" connected");
  });

const app_login_Schema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  pass: { type: String },
  repass: { type: String },
  image: { type: String },
});

const login_data = mongoose.model("App_login", app_login_Schema);

module.exports = mongoose.model("info", app_login_Schema);
