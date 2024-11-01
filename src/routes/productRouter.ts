import { Router } from "express";

const productRouter  = Router();

productRouter.get('/all', (req, res, next) => {
  console.log(`req.baseUrl ${req.baseUrl}${req.path} has been requested`);

  res.sendStatus(200);
});

export default productRouter;
