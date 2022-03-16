
const Menu  = require('../../models/menu');

function homeController(){
    return{
         async index(req,res){

            const burgers = await Menu.find();
            // console.log(burgers); 
            return res.render('home',{burgers:burgers});

            //one way to fetch the datas
            // Menu.find().then((burgers)=>{
            //     console.log(burgers);
            //     res.render('home',{burgers:burgers});
                
            // })
        }
    }
}
module.exports=homeController;