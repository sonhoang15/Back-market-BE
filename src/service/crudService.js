import db from "../models/index.js"
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
const JWTService = await import('./JWTService.js');
const { getGroupWithRoles } = JWTService.default;
import 'dotenv/config';

const JWTAction = await import("../middleware/JWTAction.js");
const { createJWT } = JWTAction.default;
const salt = bcrypt.genSaltSync(10);

const hashPassword = (password, salt) => {
    let hashPassword = bcrypt.hashSync(password, salt);
    return hashPassword;
}

const checkEmail = async (userEmail) => {
    let user = await db.User.findOne({
        where: { email: userEmail }
    });
    if (user) {
        return true
    }
    return false;
}
const checkPhone = async (userPhone) => {
    let user = await db.User.findOne({
        where: { phone: userPhone }
    });
    if (user) {
        return true
    }
    return false;
}

const registerNewUser = async (userData) => {
    try {
        let isEmailExists = await checkEmail(userData.email);
        if (isEmailExists === true) {
            return {
                EM: "Email already exists",
                EC: 1,
                DT: {}
            };
        }
        let isPhoneExists = await checkPhone(userData.phone);
        if (isPhoneExists === true) {
            return {
                EM: "Phone already exists",
                EC: 1,
                DT: {}
            };
        }
        let hashPass = hashPassword(userData.password);

        await db.User.create({
            email: userData.email,
            password: hashPass,
            phone: userData.phone,
            address: userData.address,
            username: userData.username,
            groupId: 2
        });
        return {
            EM: "User created successfully",
            EC: 0,
            DT: {}
        };
    } catch (error) {
        console.error("Error in registerNewUser:", error);
        return {
            EM: "Server error",
            EC: -2,
            DT: {}
        };
    }

}

const checkPassword = (password, hashPassword) => {
    return bcrypt.compareSync(password, hashPassword);
}
const handleUserLogin = async (data) => {

    try {
        let user;
        try {
            user = await db.User.findOne({
                where: {
                    [Op.or]: [
                        { email: data.valueLogin },
                        { phone: data.valueLogin }
                    ]
                }
            });
        } catch (err) {
            console.error("❌ DB findOne error:", err.message);
            throw err; // Cho rơi vào catch chính
        }
        if (user) {
            let isPasswordValid = checkPassword(data.password, user.password);
            if (isPasswordValid === true) {
                let groupWithRoles = await getGroupWithRoles(user)
                let payload = {
                    email: user.email,
                    username: user.username,
                    groupWithRoles,
                }
                let token = createJWT(payload)
                return {
                    EM: "Login successful",
                    EC: 0,
                    DT: {
                        access_token: token,
                        groupWithRoles,
                        email: user.email,
                        username: user.username
                    }
                }
            }
        }
        return {
            EM: "Email/phone or password does not exist",
            EC: 1,
            DT: {}
        }
    } catch (error) {
        console.error("Error in handleUserLogin:", error);
        return {
            EM: "Internal server error",
            EC: -2,
            DT: {}
        };
    }
}

export default {
    registerNewUser, handleUserLogin, hashPassword, checkEmail, checkPhone
}