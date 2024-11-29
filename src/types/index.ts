export type CamelCaseProductT = {
  articleNumber: string;
  category: string;
  subCategory: string;
  gender: string;
  isForKids: boolean;
  brand: string;
  name: string;
  sizes: string[];
  color: string;
  pattern: string;
  neckline: string;
  collar: string;
  materials: {[key: string]: string};
  sleeveLength: string;
  shape: string;
  fit: string;
  clothingLength: string;
  totalLength: string;
  trouserRise: string;
  fastening: string;
  multipack: string;
  pockets: string;
  qualities: string;
  backWidth: string;
  hoodDetail: string;
  specialSize: string;
  occasion: string;
  style: string;
  cut: string;
  collection: string;
  details: string;
  purchasePrice: string;
};

export type SnakeCaseProductT = {
  article_number: string;
  product_category_id: number;
  product_sub_category_id: number;
  gender_id: number;
  is_for_kids: boolean;
  brand_id: number;
  name: string;
  sizes: string[];
  color_id: number;
  pattern_type_id: number;
  neckline_type_id: number;
  collar_type_id: number;
  materials: {[key: string]: string};
  sleeve_length_code_id: number;
  shape_type_id: number;
  fit_type_id: number;
  clothing_length_code_id: number;
  total_length: string;
  trouser_rise_type_id: number;
  fastening_type_id: number;
  multipack_id: number;
  pockets: string;
  qualities: string;
  back_width: string;
  hood_detail: string;
  specialty_size_id: number;
  occasion_type_id: number;
  style_id: number;
  cut_type: string;
  collection_id: number;
  additional_details: string;
  purchase_price: string;
};

export type CamelCaseProductKeys = keyof CamelCaseProductT;

export type SnakeCaseProductKeys = keyof SnakeCaseProductT;

export type GenderT = 'women' | 'men';

export type ProductCategoryAggregationGroupT = 'clothing' | 'shoes';

export type ListOfProductsQuery = {
  gender: GenderT;
  categoryGroup: ProductCategoryAggregationGroupT | undefined;
  isForKids: boolean | undefined;
}
