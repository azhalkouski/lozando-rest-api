import dbClient from '../../pg_client';
import { ProductT } from '../../types';
import { productsFieldNamesToCamelCase } from './transformUtils';

export async function getClothingProducts(): Promise<ProductT[]> {
  try {
    await dbClient.connect();
    console.log('Database connection open.')

    // temporary WIP LIMIT 100
    const { rows: productsDbRows } = await dbClient.query(
      `SELECT * FROM clothing_products LIMIT 100;`
    );

    await dbClient.end();
    console.log('Database connection closed.');

    const products = productsFieldNamesToCamelCase(productsDbRows);

    return products;
  } catch(err) {
    console.log('getClothingProducts DATABASE ERROR');
    console.log(err);
    throw new Error(JSON.stringify(err));
  }
}
