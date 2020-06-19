import userController, { 
    me,
    updateMe,
    validateCreateRequestMiddleware
} from './user.controller';
import { Router } from 'express';

const router = Router();

//here we declare routes, remeber REST ARQ
router.route('/client')
    .get(userController.getMany)
    .post(userController.createOne);

router.route('/client/:id')
    .get(userController.getOne)
    .put(userController.updateOne)
    .delete(userController.removeOne);

router.route('/')
    .get(me)
    .put(updateMe);

export default router;