import { Pool, Client } from 'pg';
import { SnakeCaseProductT, ListOfProductsQuery } from '../../types';
import AppException from '../../exceptions/AppException';
import { getDbException } from './utils';

type CustomerTypeT = 'women' | 'men';


interface RelationalDbServiceI {
  readonly pgPool: Pool;
  getClothingProducts({gender, isForKids}: ListOfProductsQuery): Promise<SnakeCaseProductT[]>
}

/**
  * PostgreSQL Database Service
  */
class PgDbService implements RelationalDbServiceI {
  readonly pgPool;

  constructor(pgPool: Pool) {
    this.pgPool = pgPool;
  }

  /** 
   * @throws {AppException}
   */
  async getClothingProducts({gender, isForKids = false}: ListOfProductsQuery) {
    try {
      let whereClause = `is_for_kids = ${isForKids}`;

      const { rows: genderIds } = await this.pgPool.query(
        `SELECT id, name FROM genders;`
      );

      const genderId = genderIds.find(({id, name}) => name === gender).id
      whereClause = `gender_id = ${genderId} AND  ${whereClause}`;

      const query = `SELECT * FROM products_catalog WHERE ${whereClause};`;
      const { rows } = await this.pgPool.query<SnakeCaseProductT>(query);

      console.log(rows.length)

      return rows;
    } catch(err) {
      const dbException: AppException = getDbException(err);

      throw dbException;
    }
  }
}

export default PgDbService;
