import paymentController from './payment.controller';
import { Router } from 'express';

const router = Router();

router.route('/')
    .get(paymentController.getMany)
    .post(paymentController.createOne);
    
router.route('/:id')
    .get(paymentController.getOne)
    .delete(paymentController.removeOne)
    .put(paymentController.updateOne);

export default router;