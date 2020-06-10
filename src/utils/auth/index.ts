import jwt from "jsonwebtoken";
import config from "../../config";
import { IUser } from "../../services/users/user.interface";
import { Request } from "express";
import { Response, NextFunction } from "express-serve-static-core";
import { User } from "../../services/users/user.model";

export const newToken = (user: IUser) => {
    return jwt.sign({ id: user.id }, config.secrets.jwt, {
      expiresIn: config.secrets.jwtExp
    })
}
  
export const verifyToken = (token: string): Promise<object | unknown> =>
    new Promise((resolve, reject) => {
        jwt.verify(token, config.secrets.jwt, (err, payload) => {
        if (err) return reject(err)
        resolve(payload)
    })
});


export const protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.header('Authorization');
        if(!token) throw new Error();
        token = token.replace('Bearer ', "");
        let decoded = await <any>verifyToken(token);
        let user = await User.findOne({
            _id:decoded._id, 
            tokens: token 
        });

        if (!user) {
            throw new Error();
        }
        req.token = token;
        req.user = user;
        
        next();
    } catch (e) {
        res.status(401).send({ 
            error: 'Please authenticate.' 
        });
    }
}