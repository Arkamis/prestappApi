import { Model } from "mongoose";
import { 
    Request,
    Response,
    NextFunction
 } from "express";
import createHttpError from "http-errors";

export const getOne = (model: Model<any>) => async (req: Request, res: Response, next: NextFunction) => {
  try {
      
    const doc = await model
      .findOne({ _id: req.params.id })
      .lean()
      .exec()

    if (!doc) {
      console.log('pase por aca')
      throw createHttpError(404, 'Not data for that ID')
    }

    res.status(200).json({ data: doc })
  } catch (e) {
    if(e instanceof createHttpError){
      return next(e);
    }
    next(createHttpError(404, 'No hay registros con ese ID'));
  }
}

export const getMany = (model: Model<any>) => async (req: Request, res: Response) => {
  try {
    const docs = await model
      .find({ owner: req.user._id })
      .exec()

    res.status(200).json({ data: docs })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const createOne = (model: Model<any>) => async (req: Request, res: Response) => {
  const owner = req.user._id;
  console.log({...req.body})
  try {
    const doc = await model.create({ ...req.body, owner })
    res.status(201).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).end();
  }
}

export const updateOne = (model: Model<any>) => async (req: Request, res: Response) => {
  try {
    const updatedDoc = await model
      .findOneAndUpdate(
        {
          owner: req.user._id,
          _id: req.params.id
        },
        req.body,
        { new: true }
      )
      .setOptions({useFindAndModify: false})
      .exec()

    if (!updatedDoc) {
      return res.status(400).end()
    }

    res.status(200).json({ data: updatedDoc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const removeOne = (model: Model<any>) => async (req: Request, res: Response) => {
  try {
    const removed = await model.findOneAndRemove({
      _id: req.params.id,
      owner: req.user._id
    }).setOptions({useFindAndModify: false});
    
    if (!removed) {
      return res.status(400).end();
    }
    
    return res.status(200).json({ 
      status: "Success",
      message: `Se ha eliminado el recurso:${removed._id} con exito`
    })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const crudControllers = (model: Model<any>) => ({
  removeOne: removeOne(model),
  updateOne: updateOne(model),
  getMany: getMany(model),
  getOne: getOne(model),
  createOne: createOne(model)
});