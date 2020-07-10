
var express = require('express');
var logger = require('morgan');
const bodyParser = require('body-parser');

const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
// const cookieParser = require('cookie-parser');
const config = require('./config');
// const session  = require('express-session');
dotenv.config();
const port = process.env.port;
const userroute = require('./routes/userroute');
const User = require('./models/user');
const Match = require('./models/matched');
const { find } = require('./models/user');
var app = express();
//app.server = http.createServer(app);
// view engine setup
const server = http.createServer(app);

let socketUser = [];

app.use(cors());

app.use(bodyParser.json({
  limit: '2000kb',
}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(logger('dev'));

app.use('/user', userroute);
app.use('/uploads', express.static(__dirname + '/uploads'));
server.listen(process.env.PORT || port, () => {
  console.log(`Started server on 3000`);
});
const io = require('socket.io')(server);
io.on("connection", async (socket) => {
  //console.log(socket.id);

  let userCount = socket.client.conn.server.clientsCount;
  socket.emit('userCount', userCount);

  socket.on('sendID', data => {
    
    Match.findOne({ userid: data.userId }).then(result => {
      if(result){               
        //console.log(data);     
        result.socketid = data.socketId 
        result.save();
        //console.log(result);
      }
      else {
        const user = new Match({
          userid: data.userId,
          socketid: data.socketId,
          username: data.userName
      });
      console.log(user);
      user.save().then(ket => {
          res.status(200).json({
              message: 'tao user thanh cong'
          });
      });
      }
    }) 
  });
  socket.on('chatID', async data => {
    console.log(data);
    await Match.findOne({userid: data.sendId}).then(ketqua => {
      //console.log(ketqua.socketid);
      
      io.to(`${ketqua.socketid}`).emit('hey', 'reply me please');
    })    
  });
  socket.on('refuse', data => {
    Match.findOne({userid: data}).then(ketqua => {
      //console.log(ketqua.socketid);
      
      io.to(`${ketqua.socketid}`).emit('refuseChat', 'Cancel');
    })    
  });
  socket.on('accept', data => {
    Match.findOne({userid: data.sendId}).then(ketqua => {
      //console.log(ketqua.socketid);
      io.to(`${ketqua.socketid}`).emit('acceptchat1', 'connected');
    })   
    Match.findOne({userid: data.rcvId}).then(ketqua => {
      //console.log(ketqua.socketid);
      io.to(`${ketqua.socketid}`).emit('acceptchat2', 'connected');
    })    
  });


  socket.on("disconnect", function (data) {
   // console.log(`${socket.id} đã ngắt kết nối`);
    Match.findOne({userid: data}).then(ketqua => {
      Match.deleteOne({userid:data})
    })
    // for (let i = 0; i < socketUser.length; i++) {
    //   if (socketUser[i].userid === data) {
    //     socketUser.splice(socketUser.findIndex(index => index.userid === data), 1);
    //   }
    // }
    console.log(socketUser);
  });

  socket.on("userSendMessage", data => {
    console.log(data);
     Match.findOne({userid: data.rcvId}).then(ketqua => { 
     io.to(ketqua.socketid).emit("serverSendMessage1", { rcvid : data.rcvId,text: data.mess
    });
   });
    Match.findOne({userid: data.sendId}).then(ketqua => {
     io.to(ketqua.socketid).emit("serverSendMessage2", { rcvid : data.rcvId,text: data.mess, 
    });
   });
});


});
app.get('/', async (req, res) => {
 // await User.deleteMany();
  res.send('Great application')
});




mongoose.connect('mongodb+srv://thangtran:Thangmeo26@cluster0.wp2v0.mongodb.net/forb?retryWrites=true&w=majority', {
  useUnifiedTopology: true, useCreateIndex: true
}).then(() => { console.log('database connected') });

module.exports = app;
