var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var dotenv = require("dotenv");
dotenv.config();


var PORT = process.env.PORT || 8000;


// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var apiRoutes = require("./routes/api-routes");
var htmlRoutes = require("./routes/html-routes");
apiRoutes(app);
htmlRoutes(app);


// Connect to the Mongo DB 

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/huffpo_politics_db";
// console.log(MONGODB_URI)
mongoose.set('debug', true);
mongoose.connect(MONGODB_URI, { useNewUrlParser: true})
.then(() => {
  console.log("Mongoose is successfully connected")
})
.catch((err) => console.log(' Problem with mongodb! ' + err));
mongoose.Promise = global.Promise;

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
