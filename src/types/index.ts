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

