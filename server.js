require('dotenv').config();
const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const expressLayout  = require('express-ejs-layouts');
const PORT =process.env.PORT || 3000;
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const Emitter = require('events');

//Use of connect-mongo is to store the sessions in mongodb database not in any memory
const MongodbStore = require('connect-mongo');
const passport  = require('passport');

//database connection mongodb
const connection = mongoose.connect("mongodb://localhost/burger", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongodb connected!!!!!");
  })
  .catch((err) => console.log(err));

  //event emitter
  const eventEmitter = new Emitter()
  app.set('eventEmitter',eventEmitter);



  
//session configuration or setup
  app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave: false,
    //store the sessions in the mongo db
    store:MongodbStore.create({
      mongoUrl:process.env.MONGO_CONNECTION_URL,
    }), 
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hour
  }))

  //passport config
  // the below two lines are the passport strategies which is written in that file for all validation for login
  const passportInit = require('./app/config/passport')
  passportInit(passport);

  app.use(passport.initialize());
  app.use(passport.session());

app.use(flash());

app.use(express.static('public')) //info about the static folders
app.use(express.urlencoded({extended:false})) //for registration to show the data 

app.use(express.json());


//global middlewere for session to use in nav bar for cart  
app.use((req,res,next)=>{
  res.locals.session = req.session;
  res.locals.user = req.user
  next();
})


//set the templates
app.use(expressLayout); //to use the layouts
app.set('views',path.join(__dirname,'/resources/views')); //mention where the views present
app.set('view engine','ejs'); //which template using




//All Routes will be in this section
require('./routes/web')(app);

// app.get("/cart",(req,res)=>{
//     // res.send("hello World!")
//     res.render("cart");
// })
// app.get("/login",(req,res)=>{
//     // res.send("hello World!")
//     res.render("auth/login");
// })
// app.get("/register",(req,res)=>{
//     // res.send("hello World!")
//     res.render("auth/register");
// })






const server = app.listen(PORT,()=>{
    console.log(`server started at port ${PORT}`);
})

// socket server side

const io = require('socket.io')(server);
//JOIN
io.on('connection',(socket)=>{
  // console.log(socket.id);
  socket.on('join',(orderId)=>{
    // console.log(orderId)
    socket.join(orderId)
  })
})

eventEmitter.on('orderUpdated',(data)=>{
  io.to(`order_${data.id}`).emit('orderUpdated',data);
})

eventEmitter.on('orderPlaced',(data)=>{
  io.to('adminRoom').emit('orderPlaced',data)
})