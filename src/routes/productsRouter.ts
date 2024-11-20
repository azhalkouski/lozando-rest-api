import { Router } from "express";
import { getListOfProducts, getProductById } from '../controllers/productsController';
import withAsyncCatchMiddleware from '../middlewares/withAsyncCatchMiddleware';

const productsRouter = Router();


// GET all products
productsRouter.get('/', withAsyncCatchMiddleware(getListOfProducts));

// GET one product by id
productsRouter.get('/:id', withAsyncCatchMiddleware(getProductById));

export default productsRouter;
