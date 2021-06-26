/**
 *  helper functions for ajv keyword handlers
 */

import {Cache} from '../../../cache/Cache';
import {Facts, Trade, TradeIdentifier} from '../../../shared/Types';
import {ErrorObject, KeywordErrorDefinition} from 'ajv/dist/types';


/**
 * @desc: helper function for 'check_quantity' keyword handler
 * @param cache: cache for facts and running values
 * @param parentData: trade record data
 * @param property: quantity
 * @param data: quantity value
 * @returns: boolean. If valid or not
 */
export function QtyWithinLimit(cache: Cache, parentData: Trade, property: string, data: number): boolean | Array<ErrorObject> {

    let errors: Array<ErrorObject> = [];

    // build the key for query
    let ti = getTradeIdentifier(parentData);

    // get resource facts from cache
    let facts = getFactsFromResourceFacts(ti, cache);
    if (facts === null) {
        return true
    }

    let max_cty = facts?.get("max_capacity");
    if (max_cty === undefined) {  // no limit defined
        return true;
    } else if (data > max_cty) {    // excess to max quantity
       errors.push( {keyword: "check_quantity", message: `cannot exceed asset maximum capacity ${max_cty}`} as ErrorObject);
       return errors;
    }
    
    // query cache for running values coll
    facts = getFactsFromRunningValues(ti, cache)
    if (facts === null) {
        return true
    }

    let consumed = facts?.get("consumed_capacity");
    if (consumed === undefined) {
        consumed = 0;
    }
    if (data > max_cty - consumed) {
        errors.push({ keyword: "check_quantity", message: `cannot exceed beyond available capacity '${max_cty - consumed}'`} as ErrorObject)
        return errors;
    }
    return true
}

/**
 * @desc: helper function for 'check_quantity' keyword handler
 * @param cache: cache for facts and running values
 * @param parentData: trade record data
 * @param property: quantity
 * @param data: quantity value
 * @returns: boolean. If valid or not
 */
 export function QtyWithinLimit2(cache: Cache, parentData: Trade, property: string, data: number): boolean | Array<ErrorObject> {

    let errors: Array<ErrorObject> = [];

    // build the key for query
    let ti = getTradeIdentifier(parentData);

    // get resource facts from cache
    let facts = getFactsFromResourceFacts(ti, cache);
    if (facts === null) {
        return true
    }

    let max_cty = facts?.get("max_capacity");
    if (max_cty === undefined) {  // no limit defined
        return true;
    } else if (data > max_cty) {    // excess to max quantity
       errors.push( {keyword: "check_quantity2", message: `cannot exceed asset maximum capacity ${max_cty}`} as ErrorObject);
       return errors;
    }
    
    // query cache for running values coll
    facts = getFactsFromRunningValues(ti, cache)
    if (facts === null) {
        return true
    }
    let consumed = facts?.get("consumed_capacity");
    if (consumed === undefined) {
        consumed = 0;
    }
    if (data > max_cty - consumed) {
        errors.push({ keyword: "check_quantity2", message: `cannot exceed beyond available capacity '${max_cty - consumed}'`} as ErrorObject)
        return errors;
    }
    return true
}

/**
 * @desc: helper function for 'check_price' keyword handler
 * @param cache: cache for facts and running values
 * @param parentData: trade record data
 * @param property: price
 * @param data: price value
 * @returns: boolean. If valid or not
 */
export function PriceWithinLimit(cache: Cache, parentData: Trade, property: string, data: number): boolean | Array<ErrorObject> {

    let errors: Array<ErrorObject> = [];

    // build the key for cache query
    let ti = getTradeIdentifier(parentData);

    // get resource facts from cache
    let facts = getFactsFromResourceFacts(ti, cache);
    if (facts === null) {
        return true
    }

    // min price check
    let min_price = facts?.get("min_price");
    if ( (min_price !== undefined) && (data < min_price) ) {
       errors.push( {keyword: "check_price", message: `cannot be below market minimum price '${min_price}'`} as ErrorObject);
    }

    // max price check
    let max_price = facts?.get("max_price");
    if ( (max_price !== undefined) && (data > max_price) ) {
       errors.push( {keyword: "check_price", message: `cannot exceed market maximum price ${max_price}`} as ErrorObject);
    }

    if (errors.length != 0) {
        return errors
    }
    return true
}

export function AssetToMarket(cache: Cache, parentData: Trade, property: string, data: number): boolean | Array<ErrorObject> {

    let errors: Array<ErrorObject> = [];

    // build the key for cache query
    let ti = { 'start_date': undefined, 'end_date': undefined, 'asset': parentData.asset };

    // get resource facts from cache
    let facts = getFactsFromResourceFacts(ti, cache);
    if (facts === null) {
       return true
    }

    // min capacity check
    let min_capacity = facts?.get("min_capacity");
    if ( (min_capacity !== undefined) && (parentData.quantity < min_capacity) ) {
       errors.push( {keyword: "check_asset_to_market", message: `cannot be below market minimum capacity '${min_capacity}'`} as ErrorObject);
    }

    // max capacity check
    let max_capacity = facts?.get("max_capacity");
    if ( (max_capacity !== undefined) && (parentData.quantity > max_capacity) ) {
       errors.push( {keyword: "check_asset_to_market", message: `cannot exceed market maximum capacity ${max_capacity}`} as ErrorObject);
    }

    let valid_markets = facts?.get("valid_asset_markets");
    if (valid_markets !== undefined && valid_markets.indexOf( parentData.market ) == -1) {
        errors.push( {keyword: "check_asset_to_market", message: `Valid only in markets: [ ${valid_markets} ]`} as ErrorObject);
    }

    if (errors.length != 0) {
        return errors
    }
    return true
}

export function MarketToProduct(cache: Cache, parentData: Trade, property: string, data: number): boolean | Array<ErrorObject> {

    let errors: Array<ErrorObject> = [];

    // build the key for cache query
    let ti = { 'start_date': undefined, 'end_date': undefined, 'market': parentData.market, 'product': parentData.product };
    
    // get resource facts from cache
    let facts = getFactsFromResourceFacts(ti, cache);
    if (facts === null) {
        return true
    }

    // min price check
    if (facts?.has("min_price")) {
        let min_price = facts?.get("min_price");
        if ( (min_price !== undefined) && (parentData.price < min_price) ) {
            errors.push( {keyword: "check_market_to_product", message: `cannot be below market minimum price '${min_price}'`} as ErrorObject);
        }
    }

    if (facts?.has("max_price")) {
    // max price check
        let max_price = facts?.get("max_price");
        if ( (max_price !== undefined) && (parentData.price > max_price) ) {
            errors.push( {keyword: "check_market_to_product", message: `cannot exceed market maximum price ${max_price}`} as ErrorObject);
        }
    }

    // max capacity check
    if (facts?.has("max_capacity")) {
        let max_capacity = facts?.get("max_capacity");
        if ( (max_capacity !== undefined) && (parentData.quantity > max_capacity) ) {
            errors.push( {keyword: "check_market_to_product", message: `cannot exceed market max capacity '${max_capacity}'`} as ErrorObject);
        }
    }

    if (errors.length != 0) {
        return errors
    }
    return true
}

// gets trade identifier which uniquely identifies trade related rules and running values in cache
function getTradeIdentifier(trade: Trade): TradeIdentifier {
    return { start_date: trade.start_date,
          end_date: trade.end_date,
          portfolio: trade.portfolio,
          asset: trade.asset,
          market: trade.market 
        } as TradeIdentifier;
}


function getFactsFromResourceFacts(ti: any, cache: Cache): Map<string, any> | null {
    let rf = cache.GetResourceFact(ti);
    if ((rf === undefined) || (rf?.facts === undefined)) {
        return null;
    }

    // get facts and process
    return new Map(Object.entries(rf.facts));
}

 
function getFactsFromRunningValues(ti: any, cache: Cache): Map<string, any> | null {
    let rvs = cache.GetRunningValues(ti);
    if ((rvs === undefined) || (rvs?.facts === undefined))  {
        return null
    }

    return new Map(Object.entries(rvs.facts));
}