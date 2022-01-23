const express = require('express');
const app = express();
const ejs = require('ejs');
const ejsLayout = require('express-ejs-layouts');
const path = require('path');


app.use(express.static('public')) //info about the static folders

app.get("/",(req,res)=>{
    // res.send("hello World!")
    res.render("home");
})

//set the templates
app.use(ejsLayout); //to use the layouts
app.set('views',path.join(__dirname,'/resources/views')); //mention where the views present
app.set('view engine','ejs'); //which template using





const PORT =process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`server started at port ${PORT}`);
})