import dbPool from '../pgDbService/pgClient';
import { ProductT } from '../../types';
import { productsFieldNamesToCamelCase } from './transformUtils';
import PgDbService from '../pgDbService/PgDbService';

export async function getClothingProducts(): Promise<ProductT[]> {
  const pgDbService = new PgDbService(dbPool);
  const productsDbRows = await pgDbService.getClothingProducts();

  const products = productsFieldNamesToCamelCase(productsDbRows);

  return products;
}
