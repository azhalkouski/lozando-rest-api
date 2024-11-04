import dbClient from '../../src/pg_client';

type ProductT = {
  modelName: string;
  brandId: number;
  categoryId: number;
  size: string;
  color: string;
  forMen: boolean;
  forWomen: boolean;
  price: number;
};

type CategoryT = {
  id: number;
  name: string;
};

const brandIds = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];

const menClothingCategories = [
  { id: 4, name: 'shirts' },
  { id: 5, name: 't-shirts' },
  { id: 6, name: 'knitwear' },
  { id: 7, name: 'cardigans' },
  { id: 8, name: 'jackets' },
  { id: 9, name: 'coats' },
  { id: 10, name: 'jeans' },
  { id: 11, name: 'trousers' },
  { id: 12, name: 'sportswear' },
  { id: 13, name: 'sweatshirts' },
  { id: 14, name: 'hoodies' },
  { id: 15, name: 'suits' },
  { id: 16, name: 'polo' }
];

const womenClothingCategories = [
  { id: 1, name: 'blouses' },
  { id: 2, name: 'dresses' },
  { id: 3, name: 'tops' },
  { id: 4, name: 'shirts' },
  { id: 5, name: 't-shirts' },
  { id: 6, name: 'knitwear' },
  { id: 7, name: 'cardigans' },
  { id: 8, name: 'jackets' },
  { id: 9, name: 'coats' },
  { id: 10, name: 'jeans' },
  { id: 11, name: 'trousers' },
  { id: 12, name: 'sportswear' },
  { id: 13, name: 'sweatshirts' },
  { id: 14, name: 'hoodies' },
  { id: 15, name: 'suits' },
  { id: 16, name: 'polo' },
];

const menShoesCategories = [ 
  { id: 1, name: 'sneakers' },
  { id: 2, name: 'sports_shoes' },
  { id: 3, name: 'outdoor_shoes' },
  { id: 4, name: 'boots' },
  { id: 15, name: 'lace-up_shoes' },
  { id: 16, name: 'business_shoes' },
  { id: 17, name: 'loafers' },
  { id: 18, name: 'open_shoes' },
  { id: 19, name: 'slippers' }
];

const womenShoesCategories = [
  { id: 1, name: 'sneakers' },
  { id: 2, name: 'sports_shoes' },
  { id: 3, name: 'outdoor_shoes' },
  { id: 4, name: 'boots' },
  { id: 5, name: 'ankle_boots' },
  { id: 6, name: 'pumps' },
  { id: 7, name: 'flat_shoes' },
  { id: 8, name: 'high_heels' },
  { id: 9, name: 'sandals' },
  { id: 10, name: 'mules' },
  { id: 11, name: 'house_shoes' },
  { id: 12, name: 'ballerinas' },
  { id: 13, name: 'bridal_shoes' },
  { id: 14, name: 'beach_shoes' }
];

const colors = [
  'black', 'brown', 'beige', 'grey', 'white', 'blue', 'petrol',
  'turquoise', 'green', 'olive', 'yellow', 'orange', 'red', 'pink',
  'lilac', 'gold', 'silver', 'multi-coloured'
];

const clothingSizes = ['xs', 's', 'm', 'l', 'xl', 'xll'];

const shoesSizes = ['40', '41', '42', '43', '44', '45'];

function generateProductsList(categoryIds: CategoryT[], sizes: string[], sex: 'male' | 'female') {
  let productsList: ProductT[] = [];
  const forMen = sex === 'male';
  const forWomen = sex === 'female';

  brandIds.forEach((brandId) => {
    categoryIds.forEach((category) => {
      const productNames = generateProductNamesForCategory(category.name);

      productNames.forEach((modelName) => {
        colors.forEach((color) => {
          sizes.forEach((size) => {
            productsList.push(
              {
                modelName: modelName,
                brandId: brandId,
                categoryId: category.id,
                size: size,
                color: color,
                forMen: forMen,
                forWomen: forWomen,
                price:49.99,
              }
            );
          });
        });
      });
    });
  });

  return productsList;
};


function generateProductNamesForCategory(category: string) {
  const modelsNumbers = [
    9928, 6824, 9071, 7901, 9305, 7357, 4164, 8935, 5430, 2618, 3900, 5844,
    6760, 4020, 2773, 7282, 1236, 7600, 6548, 5557, 2019, 4000, 8208, 8370,
    3656, 4502, 1690, 1345, 2588, 7201, 1737, 1634, 3834, 7876, 1291, 4522,
    1586, 9280, 2498, 6615, 5544, 9407, 1643, 6715, 6197, 1563, 8028, 3617,
    3442, 1214
  ];

  return modelsNumbers.map((mNumber) => (`${category} ${mNumber}`));
}


const productsClothingForMen = generateProductsList(
  menClothingCategories, clothingSizes, 'male'
);
const productsClothingForWomen = generateProductsList(
  womenClothingCategories, clothingSizes, 'female'
);
const productsShoesForMen = generateProductsList(
  menShoesCategories, shoesSizes, 'male'
);
const productsShoesForWomen = generateProductsList(
  womenShoesCategories, shoesSizes, 'female'
);



const CONCURRENT_LIMIT = 100;

dbClient.connect()
  .then(async () => {
    console.log('Connected to PostgreSQL database!');
    const timeKey = 'db_save';
    console.time(timeKey);


    // populate clothing for men
    const batchesClothingForMen = splitIntoBatches(productsClothingForMen, CONCURRENT_LIMIT);

    for (let i = 0; i < batchesClothingForMen.length; i++) {
      await saveBatchOfProducts(batchesClothingForMen[i], 'clothing_products');
    }

    // populate clothing for women
    const batchesClothingForWomen = splitIntoBatches(productsClothingForWomen, CONCURRENT_LIMIT);

    for (let i = 0; i < batchesClothingForWomen.length; i++) {
      await saveBatchOfProducts(batchesClothingForWomen[i], 'clothing_products');
    }

    // populate clothing for men
    const batchesShoesForMen = splitIntoBatches(productsShoesForMen, CONCURRENT_LIMIT);

    for (let i = 0; i < batchesShoesForMen.length; i++) {
      await saveBatchOfProducts(batchesShoesForMen[i], 'shoes_products');
    }

    // populate clothing for women
    const batchesShoesForWomen = splitIntoBatches(productsShoesForWomen, CONCURRENT_LIMIT);

    for (let i = 0; i < batchesShoesForWomen.length; i++) {
      await saveBatchOfProducts(batchesShoesForWomen[i], 'shoes_products');
    }

    console.timeEnd(timeKey);
    dbClient.end()
      .then(() => console.log("Disconnected from the database."))
      .catch((err) => console.error("Disconnection error", err.stack));
  })
  .catch((err) => console.error('Connection error', err.stack));






function splitIntoBatches(products: ProductT[], batchSize: number): ProductT[][] {
  const totalSize = products.length;
  const batches: ProductT[][] = [];

  for (let i = 0; i < totalSize; i += batchSize) {
    const batchEndIndex = Math.min(i + batchSize, totalSize);

    // ! IMPORTANT
    // TODO: unit test for this bathing algirithm !
    // TODO: unit test that sliceing is performed without losses of any single element
    const batchProducts = products.slice(i, batchEndIndex);
    batches.push(batchProducts);
  }

  return batches;
};


function saveBatchOfProducts(batch: ProductT[], tableName: 'clothing_products' | 'shoes_products') {
  const batchSqlValues: string[] = batch.map((product) => {
    const {
      modelName, brandId, categoryId, size, color, forMen, forWomen, price
    } = product;

    return `('${modelName}', ${brandId}, ${categoryId}, '${size}', '${color}',
      ${forMen}, ${forWomen}, ${price})`;
  });

  const sql = `
    INSERT INTO ${tableName} (model_name, brand_id, category_id,
    size, color, for_men, for_women, price)
    VALUES ${batchSqlValues}
  `;

  return dbClient.query(sql)
    .catch((err) => {
      console.error("Query execution failed", err.stack);
      console.log(JSON.stringify(err));
    });
}

