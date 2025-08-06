import express from "express";
import apiController from "../controller/apiController";
import userController from "../controller/userController";
import groupController from "../controller/groupController";
import { checkUserJWT, checkUserPermission } from "../middleware/JWTAction"
import roleController from "../controller/roleController"
const router = express.Router();



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

    return app.use("/api/v1", router)

}

export default initApiRoutes;