import jwt from "jsonwebtoken";
import config from "../../config";
import { IUser } from "../../services/users/user.interface";
import { Request } from "express";
import { Response, NextFunction } from "express-serve-static-core";
import { User } from "../../services/users/user.model";
import createHttpError from "http-errors";
import { createTransport } from "nodemailer";

export const newToken = (user: IUser) => {
    return jwt.sign({ _id: user.id }, config.secrets.jwt, {
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
        if(!token) throw new Error('Porfavor Ingresa Credenciales');
        token = token.replace('Bearer ', "");
        const decoded = await <any>verifyToken(token);
        const user = await User.findOne({
            _id:decoded._id, 
            tokens: token 
        });

        if (!user || !user.isEmailVerified) {
            throw new Error('JsonWebTokenError');
        }
        req.token = token;
        req.user = user;
        
        next();
    } catch (e) {
        if(e.name === "JsonWebTokenError" || e.status === 403) {
            return next(createHttpError(403, e));
        }
        next(createHttpError(401, e));
    }
}

export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise < void > => {
    const user = new User({...req.body, type: 'user'});
    try {
      await user.save();
      const transporter = createTransport({
        host: 'smtp.gmail.com',
        secure: true,
        auth: {
            // should be replaced with real sender's account
          type: "login",
          user: config.email_user,
          pass: config.email_password
        }
      });
      const token = newToken(user);

      const mailOptions = {
        // should be replaced with real recipient's account
        from: config.email_user,
        to: user.email,
        subject: "Confirmacion de Cuenta",
        text: `Please follow this url:${req.originalUrl}/confirmation/${token}`
      };
      transporter.sendMail(mailOptions)
      .then(result => {
        console.log(result);
        return res.status(201).json({
          status: "Success",
          message: "Exito en el registro. Se ha enviado un link a tu correo para verificarlo."
        })
      })
      .catch(error => {
        console.error(error);
        User.findByIdAndDelete(user.id).exec();
        const err = new createHttpError.InternalServerError("Error enviando correo, porfavor intentelo mas tarde");
        next(err);
      });
    } catch (e) {
      console.error(e);

      if(e.code === 11000){
        return next(new createHttpError.Conflict("Ya hay un usuario registrado con ese correo."));
      }
      return next(new createHttpError.BadRequest("Datos invalidos porfavor ingrese characteres adecuados."));
    }
}

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);

    if(!user.isEmailVerified) throw createHttpError(403, "Porfavor verifica tu correo");
    
    const token = await user.generateAuthToken();
    console.log(user._id);
    res.status(200).json({
      status: "Success",
      user,
      token
    });
  } catch (e) {
    if(e.status === 404 || e.status == 403){
      next(e);
    }
    next(createHttpError(500, "Error comprobando token de verificacion."));
  }
}
  
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.user.tokens = <any>req.user.tokens.filter((token) => token !== req.token);
    await req.user.save();
    res.status(204).send("Se ha cerrado sesion con exito.");
  } catch (error) {
    console.error(error);
    if(error.status === 403){
      return next(error);
    }
    return next(createHttpError(500, "Error comprobando token de verificacion."));
  }
}

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.params;
      const decoded = await <any>verifyToken(token);
     
      const query = await User.findByIdAndUpdate({
        _id: decoded._id
      }, { 
        isEmailVerified: true
      });
  
      if(query){
        res.status(204).json({
          status: "Success",
          message: "Email verified with success"
        });
      }
    } catch (error) {
      console.error(error);
      if(error.name === "JsonWebTokenError") return next( createHttpError(403, error));
      return next(createHttpError(500, "Error comprobando token de verificacion."));
    }
}