import { Router } from "express";
import productsRouter from "./productsRouter";

const router = Router();

router.use('/products', productsRouter);
// router.use('/orders', ordersRouter);
// router.use('/users', usersRouter);

export default router;
