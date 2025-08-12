import express from "express";
import homeController from "../controller/homeController";
const router = express.Router();

const initWebRoutes = (app) => {
    router.get("/", homeController.handleHome);
    router.get("/user", homeController.handleUser);
    router.post("/users/create-user", homeController.handleCreateNewUser);
    router.post("/delete-user/:id", homeController.handleDeleteUser);
    router.get("/user-update/:id", homeController.handleUpdateUser);
    router.post("/users/user-update", homeController.fillUpdateUser)
    return app.use("/", router)

}

export default initWebRoutes;