import axios from 'axios';
import Noty from 'noty';
import {initAdmin} from './admin/admin';
import moment from 'moment';

let addToCart = document.querySelectorAll('.addCart');
let cartCounter = document.querySelector('#cartCounter');


function updateCart(burger){
    axios.post('/update-cart',burger).then((res)=>{
        // console.log(res);
        cartCounter.innerText = res.data.totalQty;
        new Noty({
            type:'success',
            timeout:1000,
            text:"Item Added to Cart",
            progressBar:false
            
        }).show()
    }).catch(err=>{
        new Noty({
            type:'error',
            timeout:1000,
            text:"Something went wrong",
            progressBar:false
            
        }).show()
    })
}


addToCart.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
        // console.log(e);
        let burger = JSON.parse(btn.dataset.burger)
        updateCart(burger);
        // console.log(burger);
    })
})

// Remove alert message after 2 seconds
const alertMsg = document.querySelector('#success-alert')
if(alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
}


//change order status
//accessing the hiddenInput id from single Order section
let statuses = document.querySelectorAll('.status_line')//get all 5 status 
// console.log(statuses)

let hiddenInput = document.querySelector('#hiddenInput');
let order = hiddenInput? hiddenInput.value : null;
order = JSON.parse(order)

//to show updated time
let time = document.createElement('small');

// console.log(order);
function updateStatus(order){

    statuses.forEach((status)=>{
        status.classList.remove('step-completed');
        status.classList.remove('current')
    })

    let stepCompleted = true;
    statuses.forEach((status)=>{
        let dataProp = status.dataset.status
        
        if(stepCompleted){
            status.classList.add('step-completed')
        }
        if(dataProp===order.status){
            //next ele will be coloured
            stepCompleted = false;
            
            //time show
            time.innerText = moment(order.uodatedAt).format('hh:mm A')
            status.appendChild(time);

            if(status.nextElementSibling){
                status.nextElementSibling.classList.add('current')
            }
        }
    })

}

updateStatus(order);

//socket connection client side

let socket = io();
//admin 
initAdmin(socket)

//join the private room with unique room id
//before creating room check that order exists or not
if(order){
    socket.emit('join',`order_${order._id}`)
}

let adminAreaPath = window.location.pathname
// console.log(adminAreaPath)
if(adminAreaPath.includes('admin')){
    socket.emit('join','adminRoom');
}



socket.on('orderUpdated',(data)=>{
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    // console.log(data)
    new Noty({
        type:'success',
        timeout:1000,
        text:"Order Updated",
        progressBar:false
        
    }).show()
})