import { Request, Response, NextFunction } from 'express';

export function getListOfProducts(req: Request, res: Response, next: NextFunction) {
  console.log(`req.baseUrl ${req.baseUrl}${req.path} has been requested`);

  res.sendStatus(200);
};


export function getProductById(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  console.log(`req.baseUrl ${req.baseUrl}${req.path} has been requested with param id: ${id}`);

  res.sendStatus(200);
};
