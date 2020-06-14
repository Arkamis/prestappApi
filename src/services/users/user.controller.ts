import { User } from "./user.model";
import { Request, Response } from 'express';

export const registerUser = async (req: Request, res: Response): Promise < void > => {
    const user = new User(req.body);
    try {
      await user.save()
      const token = await user.generateAuthToken();
      res.status(201).send({
        user,
        token
      });
    } catch (e) {
      console.error(e);
      res.status(400).json({
        status: "Error",
        message: "Bad params try againg"
      })
    }
}
export const authenticateUser = async (req: Request, res: Response) => {
    try {
      const user = await User.findByCredentials(req.body.email, req.body.password);
      const token = await user.generateAuthToken();
      res.send({
        user,
        token
      });
    } catch (e) {
      console.log(e);

      res.status(400).json({
        status: "error",
        message: "Correo o contrasena incorrectas, porfavor ingrese las credenciales correctas",
        error: e.toString()
      });
    }
  }
  
export const logout = async (req: Request, res: Response) => {
    try {
        if(!req.user || !req.user.tokens) throw new Error("Auth");
            req.user.tokens = <any>req.user.tokens.filter(function(token){
            return token !== req.token;
        });
        await req.user.save();
        res.send("Successfully logged out");
    } catch (error) {
        res.status(500).send("Error on logout");
    }
}

export const me = async (req: Request, res: Response) => {
    if(req.user){
      res.status(200).send(req.user);
    }
}