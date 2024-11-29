import dbPool from '../pgDbService/pgClient';
import { CamelCaseProductT, ListOfProductsQuery } from '../../types';
import { productsFieldNamesToCamelCase } from './transformUtils';
import PgDbService from '../pgDbService/PgDbService';

export async function getClothingProducts(query: ListOfProductsQuery): Promise<CamelCaseProductT[]> {
  const pgDbService = new PgDbService(dbPool);
  const productsDbRows = await pgDbService.getClothingProducts(query);

  const products = productsFieldNamesToCamelCase(productsDbRows);

  return products;
}
