import userService from "../service/userService"


// Create the connection to database


const handleHome = (req, res) => {
    return res.render("home.ejs")
}
const handleUser = async (req, res) => {

    let userList = await userService.getUserlist();
    return res.render("user.ejs", { userList })
}
const handleCreateNewUser = (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let username = req.body.username;

    userService.createNewUser(email, password, username)

    return res.redirect("/user")
}
const handleDeleteUser = async (req, res) => {

    await userService.deleteUser(req.params.id)

    return res.redirect("/user")
}
const handleUpdateUser = async (req, res) => {

    let id = req.params.id;
    let user = await userService.editUser(id)
    let data = {};
    data = user;
    return res.render("user-update.ejs", { data })
}
const fillUpdateUser = async (req, res) => {

    let email = req.body.email;
    let username = req.body.username;
    let id = req.body.id;
    await userService.updateUserInfor(email, username, id);
    return res.redirect("/user")
}
module.exports = {
    handleHome, handleUser, handleCreateNewUser, handleDeleteUser, handleUpdateUser, fillUpdateUser
}