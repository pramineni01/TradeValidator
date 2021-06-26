
import type { FuncKeywordDefinition } from 'ajv';

import { GenerateFuncKeywordDefinition } from './utils/keywordDefGenerator';
import { AssetToMarket,MarketToProduct,PriceWithinLimit,QtyWithinLimit,QtyWithinLimit2 } from './utils/utils';

// Custom keyword handlers //

// keyword: "check_price"
export function ChkPriceDef(): FuncKeywordDefinition {
  return GenerateFuncKeywordDefinition( "check_price", PriceWithinLimit);
}

// keyword: "check_quantity"
export function ChkQtyDef(): FuncKeywordDefinition {
  return GenerateFuncKeywordDefinition( "check_quantity", QtyWithinLimit);
}

// keyword: "check_quantity2"
export function ChkQtyDef2(): FuncKeywordDefinition {
  return GenerateFuncKeywordDefinition( "check_quantity2", QtyWithinLimit2);
}

// keyword: "check_asset_to_market"
export function ChkAssetToMktDef(): FuncKeywordDefinition {
  return GenerateFuncKeywordDefinition( "check_asset_to_market", AssetToMarket);
}

// keyword: "check_market_to_product"
export function ChkMktToProductDef(): FuncKeywordDefinition {
  return GenerateFuncKeywordDefinition( "check_market_to_product", MarketToProduct);
}