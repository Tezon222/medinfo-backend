const jwt = require('jsonwebtoken');
const Patient = require('../Model/Users/patientSchema');
const Doctor = require('../Model/Users/doctorSchema');

const ProtectedRoute = async(req, res, next) => {
    const { accessToken } = req.cookies;
    if (!accessToken) {
        res.status(401).json({ message: 'No access token' });
        return;
    }
        const decoded = jwt.decode(accessToken)
        const userId = decoded.user_id;
        
        if (!userId) {
            res.status(401).json({ message: 'Invalid access token' , decoded});
            return;
        }
        const patient = await Patient.findById(userId).select(['-password']);
        const doctor = await Doctor.findById(userId).select(['-password']);
        
        if (patient || doctor) {
            next();
        }else{
            res.status(401).json({ message: 'User is not authorized', patient, doctor, decoded });
            return;
        }
}
 
module.exports = ProtectedRoute;
