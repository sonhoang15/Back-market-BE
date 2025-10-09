import express from "express";
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

const initApiRoutes = (app) => {

    router.post("/register", apiController.handleRegister);
    router.post("/login", apiController.handleLogin);
    router.post("/logout", apiController.handleLogout);

    app.all('*', checkUserJWT, checkUserPermission);
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

    return app.use("/api/v1", router)

}

export default initApiRoutes;