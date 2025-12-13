import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../../config/jwt.config';

export default class JwtHelper {

    static verifyToken(token : string, secretKey : string = JWT_CONFIG.JWT_SECRET_KEY) {
        return jwt.verify(token, secretKey);
    }

    static generateToken(payload : any, secretKey : string = JWT_CONFIG.JWT_SECRET_KEY, expiresIn : number = JWT_CONFIG.JWT_EXPIRES_IN) {
        return jwt.sign(payload, secretKey, {
            expiresIn : expiresIn
        });
    }

}