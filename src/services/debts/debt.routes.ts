import debtController from './debt.controller';
import { Router } from 'express';

const router = Router();

router.route('/')
    .get(debtController.getMany)
    .post(debtController.createOne);
    
router.route('/:id')
    .get(debtController.getOne)
    .delete(debtController.removeOne)
    .put(debtController.updateOne);

export default router;