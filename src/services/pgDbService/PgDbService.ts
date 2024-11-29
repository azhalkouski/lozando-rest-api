import { Pool } from 'pg';
import { SnakeCaseProductT, ListOfProductsQuery } from '../../types';
import AppException from '../../exceptions/AppException';
import { getDbException } from './utils';
import logger from '../../utils/logger';

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
  async getClothingProducts({ gender, categoryGroup, isForKids = false }: ListOfProductsQuery) {
    try {
      let whereClause = `is_for_kids = ${isForKids}`;

      // Step 1: handle gender
      const { rows: genderIds } = await this.pgPool.query(
        `SELECT id FROM genders WHERE name = '${gender}';`
      );
      const genderId = genderIds[0].id;
      whereClause = `gender_id = ${genderId} AND  ${whereClause}`;

      // Step 2: handle categoryGroup
      // Step 2.1: determine categoryAggrGroup id
      if (categoryGroup) {
        const { rows: _categoryGroupId } = await this.pgPool.query(
          `SELECT id FROM product_categories_aggregation_groups
          WHERE name = '${categoryGroup}';`
        );
        const categoryGroupId = _categoryGroupId[0].id;

  
        // Step 2.2: define which categories fall into this categoryAggrGroup
        const { rows: productCategories } = await this.pgPool.query(
          `SELECT id FROM product_categories
          WHERE aggregation_group_id = ${categoryGroupId};`
        );
        const productCategoryIds = productCategories.map(({id}) => id);

        if (productCategoryIds.length === 0) {
          logger.warn(`No categories for categoryGroup '${categoryGroup}'?`);
          return [];
        }
  
        whereClause = `product_category_id IN (${productCategoryIds}) AND ${whereClause}`
      }

      // Step 3: select products
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
