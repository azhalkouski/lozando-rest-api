import { Pool } from 'pg';
import { SnakeCaseProductT } from '../../types';
import AppException from '../../exceptions/AppException';
import { getDbException } from './utils';


interface RelationalDbServiceI {
  readonly pgPool: Pool;
  getClothingProducts(): Promise<SnakeCaseProductT[]>
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
    const query = 'SELECT * FROM clothing_products LIMIT 100';

    try {
      const { rows } = await this.pgPool.query<SnakeCaseProductT>(query);

      return rows;
    } catch(err) {
      const dbException: AppException = getDbException(err);

      throw dbException;
    }
  }
}

export default PgDbService;
