require("dotenv").config();
import jwt from 'jsonwebtoken';

const nonSecurePaths = ['/', '/api/v1/login', '/api/v1/register', '/api/v1/logout'];

const createJWT = (payload) => {
    let key = process.env.JWT_KEY
    let token = null
    try {
        token = jwt.sign(payload, key, {
            expiresIn: process.env.JWT_EXPIRES_IN
        })
    } catch (error) {
        console.log(error)
    }

    return token
}

const verifyToken = (token) => {
    let key = process.env.JWT_KEY
    let decoded = null
    try {
        decoded = jwt.verify(token, key)

    } catch (error) {
        console.log(error);
    }
    return decoded;
}

const extractToken = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
}

const normalizeUrl = (url) => {
    return url.replace(/^\/api\/v1/, '');
};

const checkUserJWT = (req, res, next) => {
    if (nonSecurePaths.includes(req.path)) {
        return next();
    }
    let cookies = req.cookies;
    let tokenFromHeader = extractToken(req)
    if ((cookies && cookies.jwt) || tokenFromHeader) {
        let token = cookies && cookies.jwt ? cookies.jwt : tokenFromHeader;
        let decoded = verifyToken(token)
        if (decoded) {
            req.user = decoded;
            req.token = token
            next();
        } else {
            return res.status(401).json({
                EC: -1,
                DT: '',
                EM: 'not authenticated the user 2'
            })
        }
    } else {
        return res.status(401).json({
            EC: -1,
            DT: '',
            EM: 'not authenticated the user 3'
        })
    }

}

const checkUserPermission = (req, res, next) => {
    if (nonSecurePaths.includes(req.path) || req.path === '/api/v1/account') return next();
    if (req.user) {
        let email = req.user.email
        let roles = req.user.groupWithRoles.Roles
        let currentUrl = normalizeUrl(req.path)
        // console.log(" Route req.path       :", req.path);
        // console.log(" Normalized path      :", currentUrl);
        // console.log(" Roles of user        :", roles.map(r => r.url));
        if (!roles || roles.length === 0) {
            return res.status(403).json({
                EC: -1,
                DT: '',
                EM: `you don't permission to access this resource ...`
            })
        }
        let canAccess = roles.some(item => item.url === currentUrl || currentUrl.includes(item.url))
        // console.log(" Can access?          :", canAccess);
        if (canAccess === true) {
            next()
        } else {
            return res.status(403).json({
                EC: -1,
                DT: '',
                EM: `you don't permission to access this resource ...`
            })
        }
    } else {
        return res.status(401).json({
            EC: -1,
            DT: '',
            EM: 'not authenticated the user 1'
        })
    }
}
module.exports = {
    createJWT, verifyToken, checkUserJWT, checkUserPermission
}