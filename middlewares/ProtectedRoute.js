import jwt from 'jsonwebtoken'
import User from '../Model/Users/userSchema.js';

const ProtectedRoute = async(req, res, next) => {
    const { accessToken } = req.cookies;
    if (!accessToken) {
        res.status(401).json({ message: 'No access token' });
        return;
    }
        const decoded = jwt.decode(accessToken)
        const userId = decoded.user_id;
        
        if (!userId) {
            res.status(401).json({ message: 'Invalid access token'});
            return;
        }
        const user = await User.findById(userId).select(['-password']);
        // console.log(user)
        
        if (user) {
            next();
        }else{
            res.status(401).json({ message: 'User is not authorized', user, decoded });
            return;
        }
}

export default ProtectedRoute

