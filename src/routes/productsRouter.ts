import { Router } from "express";
import { getListOfProducts, getProductById } from '../controllers/productsController';

const productsRouter  = Router();

// GET all products
productsRouter.get('/', getListOfProducts);

// GET one product by id
productsRouter.get('/:id', getProductById);

export default productsRouter;
