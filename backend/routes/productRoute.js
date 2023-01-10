const express =  require ("express");
const { getAllProducts,cerateProduct, updateProduct, deleteProduct, getProductDetails, cerateProductReview, getProductReviews, deleteReviews,getAdminProducts  } = require("../controllers/productController");
const { isAuthhenticatedUser, autorizeRoles , } = require("../middleware/auth");
//route import
const router = express.Router();
  
router.route("/products").get( getAllProducts);

router
  .route("/admin/products")
  .get(isAuthhenticatedUser, autorizeRoles("admin"), getAdminProducts);

router.route("/admin/product/new").post(isAuthhenticatedUser , autorizeRoles("admin"),cerateProduct);
router.route("/admin/product/:id").put(isAuthhenticatedUser , autorizeRoles("admin"),updateProduct).delete(isAuthhenticatedUser , autorizeRoles("admin"),deleteProduct);

router.route("/product/:id").get(getProductDetails);

router.route("/review").put(isAuthhenticatedUser,cerateProductReview); 
router.route("/reviews").get(getProductReviews).delete(isAuthhenticatedUser,deleteReviews);
module.exports = router