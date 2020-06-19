import {
  Request, 
  NextFunction, 
  Response 
} from 'express';
import { IDebt, IDebtUpdateReq } from './debt.interface';
import { Debt } from './debt.model';
import createHttpError from 'http-errors';
import { crudControllers } from '../../utils/crud';

export const createNewDebt = async ( 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const debt:IDebt = req.body;
    const newDebt = await Debt.create(debt.toObject());

    res.status(201).json({
      status: "Success",
      message: "Debt Created Successfully",
      data: [newDebt]
    });
  } 
  catch (error) {
    if(error){
      next(createHttpError(500, error));
    }
    return next(createHttpError(400, error))
    
  }
};

export const updateNewDebt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id || req.body._id;
    const debt = req.body as IDebtUpdateReq;
    const update = await Debt.findByIdAndUpdate(id, debt).exec();
    if(!update) throw new Error("No se encontro deuda con ese ID")
    res.status(204);
  } catch (error) {
    if(error){
      next(createHttpError(500, error));
    }
    next(createHttpError(400, error))
    return;
  }
}

export const getDebts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parent = req.params.owner;
    //Busqueda a todas las deudas del usuario
    //busqueda de NOMBRE de Duenos
    //Haciendo "Join" a Pagos retornando:
    // totalpagado,
    // fechaDelUltimoPago
    // deudorNombre

    const payments = await Debt.find({owner: parent})
      .populate({
        path: "User",
        select: "fullName"
      })
      .populate({
        path: "Payment",
        select: "-paymentReceipts -owner -status"
      })
    .exec();

    res.status(200).json({
      status: "Success",
      data: payments
    });

    // const query = await Debt.aggregate([
    //   { $match: { owner: parent } },
    //   {
    //     $project: {
    //       "owner": "$owner.fullName"
    //     }
    //   },
    //   { 
    //     $lookup: {
    //       "from": "User",
    //       "localField": "owner",
    //       "foreignField": "_id"
    //     } 
    //   },
    //   {
      
    //   },
    //   { $lookup : {
    //       "from": "Payment",
    //       "as": "Payments",
    //       "localField": "Payments"
    //   }}
  } catch (error) {
    next(createHttpError(400, error));
  }
}

export default crudControllers(Debt);