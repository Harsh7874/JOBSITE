import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => { 
    const { token } = req.headers;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not Authorized, Login Again' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;   
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, message: 'Invalid or Expired Token' });
    }
}

export default authUser;
