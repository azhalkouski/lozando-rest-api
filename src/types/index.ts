export type InsertProductT = {
  modelName: string;
  description?: string;
  brandId: number;
  categoryId: number;
  size: string;
  color: string;
  forMen: boolean;
  forWomen: boolean;
  price: number;
};

export type ProductT = InsertProductT & {
  id: number;
  discountId: number | null;
  createdAt: Date;
}

export type SnakeCaseDBProductT = {
  id: number;
  model_name: string;
  description: string;
  brand_id: number;
  category_id: number;
  size: string;
  color: string;
  for_men: boolean;
  for_women: boolean;
  price: number;
  discount_id: number;
  created_at: Date
};


export type InputProductT = {
  article_number: string;
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
  sleeve_length: string;
  shape: string;
  fit: string;
  clothing_length: string;
  total_length: string;
  trouser_rise: string;
  fastening: string;
  multipack: string;
  pockets: string;
  qualities: string;
  back_width: string;
  hood_detail: string;
  special_size: string;
  occasion: string;
  style: string;
  cut: string;
  collection: string;
  details: string;
  purchase_price: string;
};

export type DBProductT = {
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
  fit_length_code_id: number;
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

export type InputProductKeys = keyof InputProductT;

export type DBProductKeys = keyof DBProductT;
