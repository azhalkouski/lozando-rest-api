import dbPool from '../dbService/pg_client';
import { ProductT } from '../../types';
import { productsFieldNamesToCamelCase } from './transformUtils';

export async function getClothingProducts(): Promise<ProductT[]> {
  try {
    // temporary WIP LIMIT 100
    const { rows: productsDbRows } = await dbPool.query(
      `SELECT * FROM clothing_products LIMIT 100;`
    );

    const products = productsFieldNamesToCamelCase(productsDbRows);

    return products;
  } catch(err) {
    console.log('getClothingProducts DATABASE ERROR');
    console.log(err);
    throw new Error(JSON.stringify(err));
  }
}
