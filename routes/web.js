
const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartCustomerController = require('../app/http/controllers/cartCustomerController');
const orderController = require('../app/http/controllers/orderController');
const adminOrderController = require('../app/http/controllers/adminOrderController');
const auth = require('../app/http/middleware/auth');
const admin = require('../app/http/middleware/admin');
const guest = require('../app/http/middleware/guest');
const statusAdminController = require('../app/http/controllers/statusAdminController');

//we r using guest middleware so that if we r login then we cant go to login aur register page
// if we r logged in so for login and regster as well


function allRoutes(app) {
    

  app.get("/", homeController().index );

  app.get("/login", guest,authController().login);
  app.post("/login",authController().postLogin);
  
  app.get("/register",guest, authController().register);
  app.post("/register", authController().postRegister);

  app.post("/logout", authController().logout);
  
  app.get("/cart", cartCustomerController().cart);
  app.post("/update-cart", cartCustomerController().update);

  //customer order routes
  app.post('/orders', auth, orderController().store);
  app.get('/customer/orders', auth, orderController().index)
  app.get('/customer/orders/:id', auth, orderController().show)

  //admin 
  app.get('/admin/orders',admin,adminOrderController().index)
  app.post('/admin/order/status',admin,statusAdminController().update);
}

module.exports = allRoutes;
