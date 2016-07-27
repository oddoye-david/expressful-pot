import express from 'express';

import userController from '../../../../controllers/user';

const router = express.Router();

router.get('/', userController.index);
router.get('/:id', userController.show);
router.put('/:id', userController.edit);
router.delete('/:id', userController.destroy);

export default router;