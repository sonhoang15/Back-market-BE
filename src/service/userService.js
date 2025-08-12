import bcrypt from 'bcryptjs';
import e from 'express';
import mysql from 'mysql2/promise';
import bluebird from 'bluebird';
import db from '../models/index';
import { where } from 'sequelize/lib/sequelize';

// create the connection, specify bluebird as Promise

const salt = bcrypt.genSaltSync(10);

const hashPassword = (password, salt) => {
    let hashPassword = bcrypt.hashSync(password, salt);
    return hashPassword;
}
const createNewUser = async (email, password, username) => {
    let hashPass = hashPassword(password);

    try {
        await db.User.create({
            username: username,
            email: email,
            password: password
        })
    } catch (e) {
        console.log(e)
    }


}
const getUserlist = async () => {
    let users = [];
    users = await db.User.findAll();
    return users;

}
const deleteUser = async (id) => {
    await db.User.destroy({
        where: { id: id }
    })
}
const editUser = async (id) => {
    let user = {};
    user = await db.User.findOne({
        where: { id: id }
    })
    return user.get({ plain: true })
}
const updateUserInfor = async (email, username, id) => {
    await db.User.update({
        email: email,
        username: username
    }, {
        where: { id: id }
    }
    )
}
module.exports = {
    createNewUser, getUserlist, deleteUser, editUser, updateUserInfor
}