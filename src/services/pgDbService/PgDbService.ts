import { Pool, Client } from 'pg';
import { SnakeCaseProductT, ListOfProductsQuery, GenderTypesT } from '../../types';
import AppException from '../../exceptions/AppException';
import { getDbException } from './utils';

type CustomerTypeT = 'women' | 'men';


interface RelationalDbServiceI {
  readonly pgPool: Pool;
  getClothingProducts({genderType, isForKids}: ListOfProductsQuery): Promise<SnakeCaseProductT[]>
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
  async getClothingProducts({genderType, isForKids = false}: ListOfProductsQuery) {
    try {
      let whereClause = `is_for_kids = ${isForKids}`;

      const { rows: genderIds } = await this.pgPool.query(
        `SELECT id, name FROM genders;`
      );

      const genderTypeId = genderIds.find(({id, name}) => name === genderType).id
      whereClause = `gender_id = ${genderTypeId} AND  ${whereClause}`;

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
