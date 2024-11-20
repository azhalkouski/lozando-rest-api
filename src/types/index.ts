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
