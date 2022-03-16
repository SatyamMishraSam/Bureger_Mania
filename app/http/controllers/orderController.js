const Order = require('../../models/order')
const moment = require('moment')

function orderController () {
    return {
        store(req, res) {
            // Validate request
            const { phone, address } = req.body
            if(!phone || !address) {
                return res.status(422).json({ message : 'All fields are required' });
            }

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address
            })
            order.save().then(result=>{
                Order.populate(result, {path:'customerId'},(err,placedOrder)=>{
                    req.flash('success','order placed successfully')
                    delete req.session.cart
                    
                    //emitter
                    const eventEmitter = req.app.get('eventEmitter')
                    eventEmitter.emit('orderPlaced', placedOrder)
    
                    return res.redirect('/customer/orders')
                })
                
                   
           }).catch(err=>{
               req.flash('error','Something went wrong')
               return res.redirect('/cart');
           })
        },
        async index(req, res) {
            const orders = await Order.find({ customerId: req.user._id },
                null,
                { sort: { 'createdAt': -1 } } )
            res.header('Cache-Control', 'no-store')
            res.render('orderCustomer', { orders: orders, moment: moment })
        },

        async show(req,res){
            const order = await Order.findById(req.params.id)
            //user autherization for each individual user
            if(req.user._id.toString()===order.customerId.toString()){
                return res.render('singleOrder',{order:order});//passing the order so we can access id of the users
            }
            res.redirect('/')
        }
        
    }
}

module.exports = orderController