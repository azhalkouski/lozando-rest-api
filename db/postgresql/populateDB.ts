import { configDotenv } from 'dotenv';
import pg, { Client } from 'pg';
const { Client: PgClient } = pg;
import { CamelCaseProductKeys, SnakeCaseProductKeys } from '../../src/types';
import { clothingProducts } from '../../productsData';
import {
  BRANDS,
  GENDERS,
  PRODUCT_CATEGORIES_AGGREGATION_GROUPS,
  PRODUCT_CATEGORIES_WITH_AGGREGATION_GROUPS,
  PRODUCT_SUB_CATEGORIES,
  COLORS,
  UPPER_LOWER_WEAR_SIZES,
  FEET_SIZES,
  COLLAR_TYPES,
  NECKLINE_TYPES,
  FASTENING_TYPES,
  FIT_TYPES,
  TROUSER_RISE_TYPES,
  PATTER_TYPES,
  SHAPE_TYPES,
  CLOTHING_LENGTH_CODES,
  SLEEVE_LENGTH_CODES,
  MATERIALS,
  LINING_MATERIALS,
  OCCASION_TYPES,
  FASHION_COLLECTIONS
} from './nonSensitiveDbData';

configDotenv();


async function populateDB() {
  const client = new PgClient({
    user: process.env.PG_DEV_DATABASE_USER,
    host: process.env.PG_DEV_DATABASE_HOST,
    port: parseInt(process.env.PG_DEV_DATABASE_PORT || '5432'),
    database: process.env.PG_DEV_DATABASE_NAME,
  });

  await client.connect();

  try {
    await client.query('BEGIN');

    // Step 1
    await populateIndependentProductAttrs(client);

    // Step 2
    await populateProductCategories(client);

    // Step 3
    await populateProductSubCategories(client);

    // Step 4
    await populateProductsCatalog(client);

    await client.query('COMMIT');
    console.log('Database has been populated');

  } catch(e) {
    console.log(e);
    await client.query('ROLLBACK');
  } finally {
    await client.end();
  }

}

populateDB();




async function populateIndependentProductAttrs(pgClient: Client) {
  const queries = getSqlQueriesForPopulateIndependentProductAttrs();
  for (let i=0; i<queries.length; i++) {
    await pgClient.query(queries[i]);
  }
};

function getSqlQueriesForPopulateIndependentProductAttrs() {
  // independent tables
  const tableNamesToTableValues: [string, string[]][] = [
    ['genders', GENDERS],
    ['product_categories_aggregation_groups', PRODUCT_CATEGORIES_AGGREGATION_GROUPS],
    ['brands', BRANDS],
    ['pattern_types', PATTER_TYPES],
    ['colors', COLORS],
    ['collar_types', COLLAR_TYPES],
    ['neckline_types', NECKLINE_TYPES],
    ['multipacks', []],
    ['materials', MATERIALS],
    ['sleeve_length_codes', SLEEVE_LENGTH_CODES],
    ['clothing_length_codes', CLOTHING_LENGTH_CODES],
    ['lining_materials', LINING_MATERIALS],
    ['upper_lower_wear_sizes', UPPER_LOWER_WEAR_SIZES],
    ['feet_sizes', FEET_SIZES],
    ['shape_types', SHAPE_TYPES],
    ['fit_types', FIT_TYPES],
    ['specialty_sizes', []],
    ['trouser_rise_types', TROUSER_RISE_TYPES],
    ['occasion_types', OCCASION_TYPES],
    ['styles', []],
    ['fashion_collections', FASHION_COLLECTIONS],
    ['fastening_types', FASTENING_TYPES],
  ];

  
  function _getSqlQuery(tableName: string, values: string[]) {
    if (values.length === 0) {
      return '';
    }

    const _values = values.map((el) => `('${el}')`);
    return `INSERT INTO ${tableName} (name) VALUES ${_values};`;
  }

  return tableNamesToTableValues.map((pair) => {
    const tableName: string = pair[0];
    const tableValues = pair[1];
    return _getSqlQuery(tableName, tableValues);
  });
};


async function populateProductCategories(pgClient: Client) {
  const {rows: productCatAggrGroups} = await pgClient.query(
    `SELECT id, name FROM product_categories_aggregation_groups;`
  );
  const productCategoriesValues = PRODUCT_CATEGORIES_WITH_AGGREGATION_GROUPS
    .map((catNameWithAggrGroup) => {
      const [catName, aggrGroupName] = catNameWithAggrGroup;
      const aggrGroupId = productCatAggrGroups
        .find((a) => a.name === aggrGroupName)
        .id;
      return `('${catName}', '${aggrGroupId}')`
    });

  await pgClient.query(
    `INSERT INTO product_categories (name, aggregation_group_id)
      VALUES ${productCategoriesValues};`
  );
}


async function populateProductSubCategories(pgClient: Client) {
  const categories = await pgClient.query('SELECT * FROM product_categories;');
  const subCategoriesValues = PRODUCT_SUB_CATEGORIES.map((cat) => {
    const { id } = categories.rows.find((el) => el.name === cat[0]);
    return `(${id}, '${cat[1]}')`;
  });

  const query = `
    INSERT INTO product_sub_categories
    (product_category_id, name)
    VALUES
    ${subCategoriesValues}
  `
  await pgClient.query(query);
}



async function populateProductsCatalog(pgClient: Client) {
  /**
   * Since I don't use an ORM, I need to map input objects to database objects.
   * The keys are not the same and I need to map them.
   */
  const sqlFieldsToInputFields: {[key in SnakeCaseProductKeys]: CamelCaseProductKeys} = {
    'article_number': 'articleNumber',
    'product_category_id': 'category',
    'product_sub_category_id': 'subCategory',
    'gender_id': 'gender',
    'is_for_kids': 'isForKids',
    'brand_id': 'brand',
    'name': 'name',
    'sizes': 'sizes',
    'color_id': 'color',
    'pattern_type_id': 'pattern',
    'neckline_type_id': 'neckline',
    'collar_type_id': 'collar',
    'materials':  'materials',
    'sleeve_length_code_id': 'sleeveLength',
    'shape_type_id': 'shape',
    'fit_type_id': 'fit',
    'clothing_length_code_id': 'clothingLength',
    'total_length': 'totalLength',
    'trouser_rise_type_id': 'trouserRise',
    'fastening_type_id': 'fastening',
    'multipack_id': 'multipack',
    'pockets': 'pockets',
    'qualities': 'qualities',
    'back_width': 'backWidth',
    'hood_detail': 'hoodDetail',
    'specialty_size_id': "specialSize",
    'occasion_type_id': 'occasion',
    'style_id': 'style',
    'cut_type': 'cut',
    'collection_id': 'collection',
    'additional_details': 'details',
    'purchase_price': 'purchasePrice',
  };

  /**
   * SELECT necessary (id, name) pairs from tables which products_catalog tabel
   * REFERENCES by ids as FOREIGN KEYS
   */
  const queryProductCategories = `SELECT id, name FROM product_categories;`;
  const { rows: allProductCategories } = await pgClient.query(queryProductCategories);
  const queryProductSubCategories = `SELECT id, name FROM product_sub_categories;`;
  const { rows: allProductSubCategories } =
    await pgClient.query(queryProductSubCategories);
  const queryGenders = `SELECT id, name FROM genders;`;
  const { rows: allGenders } = await pgClient.query(queryGenders);
  const queryBrands = `SELECT id, name FROM brands;`;
  const { rows: allBrands } = await pgClient.query(queryBrands);
  const queryColors = `SELECT id, name FROM colors;`;
  const { rows: allColors } = await pgClient.query(queryColors);
  const queryPatternTypes = `SELECT id, name FROM pattern_types;`;
  const { rows: allPatternTypes } = await pgClient.query(queryPatternTypes);
  const queryNecklineTypes = `SELECT id, name FROM neckline_types;`;
  const { rows: allNecklineTypes } = await pgClient.query(queryNecklineTypes);
  const queryCollarTypes = `SELECT id, name FROM collar_types;`;
  const { rows: allCollarTypes } = await pgClient.query(queryCollarTypes);
  const querySleeveLengthCodes = `SELECT id, name FROM sleeve_length_codes;`;
  const { rows: allSleeveLengthCodes } = await pgClient.query(querySleeveLengthCodes);
  const queryShapeTypes = `SELECT id, name FROM shape_types;`;
  const { rows: allShapeTypes } = await pgClient.query(queryShapeTypes);
  const queryFitTypes = `SELECT id, name FROM fit_types;`;
  const { rows: allFitTypes } = await pgClient.query(queryFitTypes);
  const queryFitLengthCodes = `SELECT id, name FROM CLOTHING_LENGTH_CODES;`;
  const { rows: allFitLengthCodes } = await pgClient.query(queryFitLengthCodes);
  const queryTrouserRiseTypes = `SELECT id, name FROM trouser_rise_types;`;
  const { rows: allTrouserRiseTypes } = await pgClient.query(queryTrouserRiseTypes);
  const queryFasteningTypes = `SELECT id, name FROM fastening_types;`;
  const { rows: allFasteningTypes } = await pgClient.query(queryFasteningTypes);
  const queryMultipacks = `SELECT id, name FROM multipacks;`;
  const { rows: allMultipacks } = await pgClient.query(queryMultipacks);
  const querySpecialtySizes = `SELECT id, name FROM specialty_sizes;`;
  const { rows: allSpecialtySizes } = await pgClient.query(querySpecialtySizes);
  const queryOccasionTypes = `SELECT id, name FROM occasion_types;`;
  const { rows: allOccasionTypes } = await pgClient.query(queryOccasionTypes);
  const queryStyles = `SELECT id, name FROM styles;`;
  const { rows: allStyles } = await pgClient.query(queryStyles);
  const queryFashionCollections = `SELECT id, name FROM fashion_collections;`;
  const { rows: allFashionCollections } = await pgClient.query(queryFashionCollections);



  /**
   * Now, when I have all the necessary (id, name) pairs of the table I need to
   * reference, I can map/convert input products to valid rows which can be
   * INSERTed into the products_catalog TABLE.
   * 
   * The map function returns an array of strings. Those string are effectively the
   * strings which are passed to the sql query after the keyword VALUES.
   */
  const productValues = clothingProducts.map((product) => {

    function getId(allRows: {id: string, name: string}[], sqlFieldName: SnakeCaseProductKeys) {
      const productFiledName: CamelCaseProductKeys = sqlFieldsToInputFields[sqlFieldName];


      const valueInProduct = product[productFiledName];
      if (valueInProduct === undefined || valueInProduct === '') {
        return null;
      }
      const foundDbRow = allRows.find((s) => s.name === valueInProduct);

      if (foundDbRow === undefined) {
        throw new Error(`Product with unexpected value "${valueInProduct}" at field "${productFiledName}" has attempted to be written in db column "${sqlFieldName}"`)
      }
      return foundDbRow.id;
    }

    function toBJSONString(obj: any, hostKey: 'sizes' | 'materials') {
      return JSON.stringify({ [hostKey]: obj });
    }

    function wrapWithSingleQuotes(value: any) {
      return `'${value}'`
    }

    const article_number = wrapWithSingleQuotes(
      product[sqlFieldsToInputFields.article_number]
    );
    const product_category_id = getId(allProductCategories, 'product_category_id');
    const product_sub_category_id = getId(
      allProductSubCategories, 'product_sub_category_id'
    );
    const gender_id = getId(allGenders, 'gender_id');
    const is_for_kids = product[sqlFieldsToInputFields.is_for_kids] || false;
    const brand_id = getId(allBrands, 'brand_id');
    const name = wrapWithSingleQuotes(product[sqlFieldsToInputFields.name]);
    const sizes = wrapWithSingleQuotes(
      toBJSONString(product[sqlFieldsToInputFields.sizes], 'sizes')
    );
    const color_id = getId(allColors, 'color_id');
    const pattern_type_id = getId(allPatternTypes, 'pattern_type_id');
    const neckline_type_id = getId(allNecklineTypes, 'neckline_type_id');
    const collar_type_id = getId(allCollarTypes, 'collar_type_id');
    const materials = wrapWithSingleQuotes(
      toBJSONString(product[sqlFieldsToInputFields.materials], 'materials')
    );
    const sleeve_length_code_id = getId(allSleeveLengthCodes, 'sleeve_length_code_id');
    const shape_type_id = getId(allShapeTypes, 'shape_type_id');
    const fit_type_id = getId(allFitTypes, 'fit_type_id');
    const clothing_length_code_id = getId(allFitLengthCodes, 'clothing_length_code_id');
    const total_length = wrapWithSingleQuotes(
      product[sqlFieldsToInputFields.total_length] || ''
    );
    const trouser_rise_type_id = getId(allTrouserRiseTypes, 'trouser_rise_type_id');
    const fastening_type_id = getId(allFasteningTypes, 'fastening_type_id');
    const multipack_id = getId(allMultipacks, 'multipack_id');
    const pockets = wrapWithSingleQuotes(
      product[sqlFieldsToInputFields.pockets || '']
    );
    const qualities = wrapWithSingleQuotes(
      product[sqlFieldsToInputFields.qualities || '']
    );
    const back_width = wrapWithSingleQuotes(
      product[sqlFieldsToInputFields.back_width || '']
    );
    const hood_detail = wrapWithSingleQuotes(
      product[sqlFieldsToInputFields.hood_detail || '']
    );
    const specialty_size_id = getId( allSpecialtySizes, 'specialty_size_id');
    const occasion_type_id = getId(allOccasionTypes, 'occasion_type_id');
    const style_id = getId(allStyles, 'style_id');
    const cut_type = wrapWithSingleQuotes(
      product[sqlFieldsToInputFields.cut_type || '']
    );
    const collection_id = getId(allFashionCollections, 'collection_id');
    const additional_details = wrapWithSingleQuotes(
      product[sqlFieldsToInputFields.additional_details || '']
    );
    const purchase_price = wrapWithSingleQuotes(
      product[sqlFieldsToInputFields.purchase_price || '']
    );

    return `(${article_number}, ${product_category_id}, ${product_sub_category_id},
      ${gender_id}, ${is_for_kids}, ${brand_id}, ${name}, ${sizes}, ${color_id},
      ${pattern_type_id}, ${neckline_type_id}, ${collar_type_id}, ${materials},
      ${sleeve_length_code_id}, ${shape_type_id}, ${fit_type_id}, ${clothing_length_code_id},
      ${total_length}, ${trouser_rise_type_id}, ${fastening_type_id}, ${multipack_id},
      ${pockets}, ${qualities}, ${back_width}, ${hood_detail}, ${specialty_size_id},
      ${occasion_type_id}, ${style_id}, ${cut_type}, ${collection_id},
      ${additional_details}, ${purchase_price})`;
  });

  const insertIntoProductsCatalogQuery = `
    INSERT INTO products_catalog
    ( article_number, product_category_id, product_sub_category_id, gender_id,
     is_for_kids, brand_id, name, sizes, color_id, pattern_type_id, neckline_type_id,
     collar_type_id, materials, sleeve_length_code_id, shape_type_id, fit_type_id,
     clothing_length_code_id, total_length, trouser_rise_type_id, fastening_type_id,
     multipack_id, pockets, qualities, back_width, hood_detail, specialty_size_id,
     occasion_type_id, style_id, cut_type, collection_id, additional_details,
     purchase_price )
    VALUES
    ${productValues};
  `;


  await pgClient.query(insertIntoProductsCatalogQuery);
}
