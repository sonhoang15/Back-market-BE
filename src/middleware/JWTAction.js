import 'dotenv/config';
import jwt from 'jsonwebtoken';

const nonSecurePaths = ['/api/v1/home', '/api/v1/login', '/api/v1/register', '/api/v1/logout', '/api/v1/auth', '/api/v1/product/by-category-advanced', '/api/v1/product/best-seller', '/api/v1/product/newest'];

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
    if (nonSecurePaths.some(path => req.path.startsWith(path))) {
        return next();
    }

    let cookies = req.cookies;
    let tokenFromHeader = extractToken(req);

    if ((cookies && cookies.jwt) || tokenFromHeader) {
        let token = cookies && cookies.jwt ? cookies.jwt : tokenFromHeader;

        let decoded = verifyToken(token);

        if (decoded) {
            req.user = decoded;
            req.token = token;
            next();
        } else {
            return res.status(401).json({
                EC: -1,
                DT: '',
                EM: 'not authenticated the user 2'
            });
        }
    } else {
        console.log(" No JWT found in cookies or header");
        return res.status(401).json({
            EC: -1,
            DT: '',
            EM: 'not authenticated the user 3'
        });
    }
};


const checkUserPermission = (req, res, next) => {
    if (nonSecurePaths.some(path => req.path.startsWith(path)) || req.path === '/api/v1/account') return next();
    if (req.user) {
        let email = req.user.email
        let roles = req.user.groupWithRoles.Roles
        let currentUrl = normalizeUrl(req.path)
        if (!roles || roles.length === 0) {
            return res.status(403).json({
                EC: -1,
                DT: '',
                EM: `you don't permission to access this resource ...`
            })
        }
        let canAccess = roles.some(item => item.url === currentUrl || currentUrl.includes(item.url))
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
export default { createJWT, verifyToken, checkUserJWT, checkUserPermission };