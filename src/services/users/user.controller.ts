import { User } from "./user.model";
import { Request, Response, NextFunction } from 'express';
import { userUpdateMask, createUserMask } from "./user.interface";
import { crudControllers } from "../../utils/crud";
import createHttpError from "http-errors";

export const validateCreateRequestMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const requestCreate:createUserMask = {...req.body}
    req.body = requestCreate;
    next();
    
  } catch (error) {
    next(createHttpError(400, 'Invalid Request'));
  }
}
export const me = async (req: Request, res: Response) => {
  res.status(200).json({data: req.user});
  
}

export const updateMe = async (req: Request, res: Response) => {
  try {
    const updateMask: userUpdateMask = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, updateMask, {
      new: true
    })
      .exec()

    res.status(200).json({ data: user })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export default crudControllers(User);