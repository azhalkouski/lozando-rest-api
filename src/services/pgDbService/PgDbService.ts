import { Pool } from 'pg';
import { SnakeCaseDBProductT } from '../../types';
import AppException from '../../exceptions/AppException';
import { getDbException } from './utils';


interface RelationalDbServiceI {
  readonly pgPool: Pool;
  getClothingProducts(): Promise<SnakeCaseDBProductT[]>
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
  async getClothingProducts() {
    // ! temporary hardcoded LIMIT 100
    const query = 'SELECT * FROM clothding_products LIMIT 100';

    try {
      const { rows } = await this.pgPool.query<SnakeCaseDBProductT>(query);

      return rows;
    } catch(err) {
      const dbException: AppException = getDbException(query, err);

      throw dbException;
    }
  }
}

export default PgDbService;
