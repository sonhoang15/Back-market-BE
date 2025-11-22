import express from "express";
import productController from "../controller/productController.js";
import variantController from "../controller/variantController.js";
import clientController from "../controller/clientController.js";
import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({ storage });

const router = express.Router();

const JWTActionModule = await import("../middleware/JWTAction.js");
const { checkUserJWT, checkUserPermission } = JWTActionModule.default;

const apiControllerModule = await import("../controller/apiController.js");
const apiController = apiControllerModule.default;

const userControllerModule = await import("../controller/userController.js");
const userController = userControllerModule.default;

const groupControllerModule = await import("../controller/groupController.js");
const groupController = groupControllerModule.default;

const categoryControllerModule = await import("../controller/categoryController.js");
const categoryController = categoryControllerModule.default;

const roleControllerModule = await import("../controller/roleController.js");
const roleController = roleControllerModule.default;

const cartControllerModule = await import("../controller/cartController.js");
const cartController = cartControllerModule.default;

const emailControllerModule = await import("../controller/emailController.js");
const emailController = emailControllerModule.default;


const initApiRoutes = (app) => {

    router.post("/register", apiController.handleRegister);
    router.post("/login", apiController.handleLogin);
    router.post("/logout", apiController.handleLogout);

    router.post("/orders/save", clientController.saveOrder);
    router.get("/product/search", clientController.searchProductsController);
    router.post("/order/email", emailController.sendOrderEmail);

    // Xóa dòng app.all('*', checkUserJWT, checkUserPermission);

    router.get("/account", userController.getUserAccount)
    router.get("/user/read", userController.read);
    router.post("/user/create", userController.create);
    router.put("/user/update", userController.update);
    router.delete("/user/delete", userController.DeleteUser);


    router.get("/role/read", roleController.read);
    router.post("/role/create", roleController.create);
    router.put("/role/update", roleController.update);
    router.delete("/role/delete", roleController.deleteRoles);
    router.get("/role/by-group/:groupId", roleController.getRolesByGroup);
    router.post("/role/assign-to-group", roleController.assignToGroup);


    router.get("/group/read", groupController.read);
    router.post("/group/create", groupController.create);
    router.delete("/group/delete", groupController.deleteGroup);

    router.post("/category/create", categoryController.create);
    router.get("/category/read", categoryController.read);
    router.put("/category/update/:id", categoryController.update);
    router.delete("/category/delete/:id", categoryController.deleteCategories);


    router.get("/product/read", productController.getAllProducts);
    router.get("/product/read/:id", productController.getProductById);
    router.post("/product/create", upload.fields([{ name: "thumbnail", maxCount: 10 }, { name: "variantImages", maxCount: 50 }]), productController.createProduct);
    router.put("/product/update/:id", upload.single("thumbnail"), productController.updateProduct);
    router.delete("/product/delete/:id", productController.deleteProduct);

    router.get("/variant/read/:product_id", upload.any(), variantController.getVariantsByProduct);
    router.put("/variant/update/:id", upload.any(), variantController.updateVariant);
    router.post("/variant/create", upload.any(), variantController.createVariant);
    router.delete("/variant/delete/:id", variantController.deleteVariant);


    router.get("/cart/read", cartController.getCart);
    router.post("/cart/add-item", cartController.addToCart);
    router.put("/cart/update/:itemId", cartController.updateCartItem);
    router.delete("/cart/delete/:itemId", cartController.removeCartItem);
    router.post("/cart/checkout", cartController.checkoutCart);
    router.delete("/cart/clear/:cartId", cartController.clearCartController);

    router.get("/product/by-category-advanced/:category_id", clientController.getProductsByCategoryAdvanced);
    router.get("/profile", clientController.getProfile);
    router.put("/profile/update", clientController.updateProfile);
    router.get("/orders/all", clientController.getAllOrders);
    router.get("/orders/detail/:id", clientController.getOrderDetail);
    router.put("/order/update-status/:id", clientController.updateOrderStatus);
    router.get("/product/best-seller", clientController.bestSeller);
    router.get("/product/newest", clientController.newestProducts);

    return app.use("/api/v1", router)

}

export default initApiRoutes;