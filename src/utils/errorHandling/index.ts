import { Request, Response, NextFunction } from 'express';
import { Errorhttp } from '../../interfaces';

export const errorHandler = async (error: Errorhttp, req: Request, res: Response, next:NextFunction): Promise<void> => {
  console.error("Mi error:", error);
  if(!error){
    return;
  }
  // const user = req.user;
  const code = error.statusCode;

  switch(true){
    case code > 400:
      res.status(code).json({
        status: "Error",
        error: {
          mensaje: error.message,
          nombre: error.name
        }
      });
      break;
    default:

      break;
  }
}