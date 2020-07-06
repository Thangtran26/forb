
var express = require('express');
var logger = require('morgan');
const bodyParser = require('body-parser');

const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const passport = require('passport');
const FacebookStrategy  = require('passport-facebook').Strategy;
// const cookieParser = require('cookie-parser');
const config = require('./config');
// const session  = require('express-session');
dotenv.config();
const port = process.env.port;
const userroute = require('./routes/userroute');
const User = require('./models/user');
var app = express();
//app.server = http.createServer(app);
// view engine setup
const server = http.createServer(app);

app.use(cors());

app.use(bodyParser.json({
  limit: '2000kb',
}));
app.use(bodyParser.urlencoded({extended: true}));

app.use(logger('dev'));

app.use('/user',userroute);
app.use('/uploads', express.static(__dirname + '/uploads'));
server.listen(port,() =>{
  console.log(`Started server on 3000`);
});
const io = require('socket.io')(server);
// io.on("connection", function(socket) {
//   console.log('new connection' + socket.id);
//   socket.on("disconnect", function() {
//     console.log(socket.id + "user del like you");
//   });
//   socket.on("Say Hello", function(data) {
//     console.log(data);
//     //io.sockets.emit("Rep", data + "hello con cac");
//     io.to("ukZj38-a12iQCihYAAAB").emit("Rep", data + "hello con cac");
//   });
// });
app.get('/', async (req, res) => {
   //await User.deleteMany();
  res.send('Great application')
});




mongoose.connect('mongodb://localhost:27017',{
  useUnifiedTopology: true, useCreateIndex: true
}).then(() => {console.log('database connected')});

module.exports = app;
