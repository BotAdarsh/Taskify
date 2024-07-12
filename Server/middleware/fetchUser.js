const jwt = require('jsonwebtoken');

const JWT_SECRET = "This is secret key for verification";

const fetchUser = (req, res, next) => {
    const token = req.header('authtoken');
    if (!token) {
        return res.status(401).json({ error: "please authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        return res.status(401).send({ error: "Some internal error occured 1" });
    }
}

module.exports = fetchUser;