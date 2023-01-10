const express = require("express");
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require("../controllers/orderController");
const router = express.Router();
const { isAuthhenticatedUser, autorizeRoles } = require("../middleware/auth");

router.route("/order/new").post(isAuthhenticatedUser,newOrder);
router.route("/order/:id").get(isAuthhenticatedUser,getSingleOrder);
router.route("/orders/me").get(isAuthhenticatedUser,myOrders);
router.route("/admin/orders").get(isAuthhenticatedUser,autorizeRoles("admin"),getAllOrders);
router.route("/admin/orders").get(isAuthhenticatedUser,autorizeRoles("admin"),getAllOrders);
router.route("/admin/order/:id").put(isAuthhenticatedUser,autorizeRoles("admin"),updateOrder)
.delete(isAuthhenticatedUser,autorizeRoles("admin"),deleteOrder);


module.exports= router; 