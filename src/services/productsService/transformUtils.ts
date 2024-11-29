import { CamelCaseProductT } from "../../types";
import { snakeToCamelCaseFields } from '../../utils';

export function productsFieldNamesToCamelCase(products: Record<string, any>[]) {
  return products.map((product) => snakeToCamelCaseFields<CamelCaseProductT>(product));
}
