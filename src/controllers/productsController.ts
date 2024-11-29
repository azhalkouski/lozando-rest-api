import { Request, Response, NextFunction } from 'express';
import { getClothingProducts } from '../services/productsService/productsService';
import { ListOfProductsQuery } from '../types';

export async function getListOfProducts(
  req: Request, res: Response, next: NextFunction
) {
  const query = req.query as unknown as ListOfProductsQuery;
  const clothingProducts = await getClothingProducts(query);

  res.json(clothingProducts);
};


export function getProductById(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  console.log(
    `req.baseUrl ${req.baseUrl}${req.path} has been requested withparam id: ${id}`
  );

  res.sendStatus(200);
};
