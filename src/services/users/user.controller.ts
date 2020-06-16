import { User } from "./user.model";
import e, { Request, Response, NextFunction } from 'express';
import { createTransport } from "nodemailer";
import config from '../../config';
import { newToken, verifyToken } from "../../utils/auth";
import createHttpError from 'http-errors';
import { nextTick } from "process";


export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise < void > => {
    const user = new User(req.body);
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
        return res.status(200).json({
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

    if(!user.email_verified) throw createHttpError(403, "Porfavor verifica tu correo");
    
    const token = await user.generateAuthToken();
    res.status(200).json({
      status: "Success",
      user,
      token
    });
  } catch (e) {
    if(e.status === 404 || e.status == 403){
      next(e);
    }
    next(createHttpError(500, "Internal Server Error Validating Token"));
  }
}
  
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if(!req.user || !req.user.tokens) throw createHttpError(403, "Porfavor Autenticate.");
      req.user.tokens = <any>req.user.tokens.filter(function(token){
      return token !== req.token;
    });
    await req.user.save();
    res.status(204).send("Se ha cerrado sesion con exito.");
  } catch (error) {
    console.error(error);
    if(error.status === 403){
      return next(e)
    }
    return next(createHttpError(500, "Internal Server Error en el signOut"));
  }
}

export const me = async (req: Request, res: Response) => {
  if(req.user){
    res.status(200).send(req.user);
  }
}

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;
    const decoded = await <any>verifyToken(token);
   
    const query = await User.findByIdAndUpdate({
      _id: decoded._id
    }, { 
      email_verified: true
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