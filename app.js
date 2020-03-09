const express = require("express");
const debug = require("debug")("app");
const chalk = require("chalk");
const http = require("http");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const app = express();
require('dotenv').config();

const port = process.env.PORT;
mongoose.Promise = global.Promise;
const databaseUri = process.env.MONGODB_URI || 'mongodb://localhost/Zanibal';

mongoose.connect(databaseUri, { 
  useNewUrlParser: true,
  useUnifiedTopology: true
})
      .then(() => console.log(`Database connected`))
      .catch(err => console.log(`Database connection error: ${err.message}`));
      
const server = http.createServer(app);
app.use(morgan("tiny"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public/")));
app.use(cookieParser());
app.use(expressSession({ secret: 'zanibal', resave: true, saveUninitialized: true }));
require('./config/passportConfig')(app);
app.use(
  "*/css",
  express.static(path.join(__dirname, "/node_modules/bootstrap/dist/css"))
);
app.use(
  "*/css",
  express.static(path.join(__dirname, "/node_modules/font-awesome/css"))
);
app.use(
  "*/css",
  express.static(path.join(__dirname, "/public/css"))
);
app.use(
  "*/js",
  express.static(path.join(__dirname, "/node_modules/bootstrap/dist/js"))
);
app.use(
  "*/js",
  express.static(path.join(__dirname, "/node_modules/jquery/dist"))
);
app.use(
  "*/js",
  express.static(path.join(__dirname, "/public/js"))
);
app.use(
  "*/img",
  express.static(path.join(__dirname, "/public/img"))
)

const quizRouter = require("./routes/applicantRoute")();
const adminRouter = require("./routes/adminRoute")();
const authRouter = require("./routes/authRoute")();

app.use('/applicant', quizRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  return res.redirect('/applicant');
});

server.listen(port, () => {
  debug(chalk.green(`Server listening on port ${port}`));
});

module.exports = app;