import Ajv, {JSONSchemaType} from "ajv";
import addFormats from "ajv-formats";

import {Cache} from '../cache/Cache';
import {Trade, TradeFact} from '../shared/Types';

// keywords
import { ChkAssetToMktDef,ChkPriceDef,ChkQtyDef,ChkQtyDef2,ChkMktToProductDef } from './vocabulary/keywords';

export class TradeValidator {
    private cache: Cache;

    // constructor
    constructor(cache: Cache) {
        this.cache = cache;
    }

    // methods
    public Validate(trades: ReadonlyArray<Trade>) {
        let schema: JSONSchemaType<Array<TradeFact>> | null = this.cache.GetSchema();
        if (schema === null) {
            console.log('TradeValidator: validation schema missing');
            return false;
        }

        // create ajv
        console.log("Creating Ajv instance ...")
        let ajv: Ajv = new Ajv({passContext: true, allErrors: true, coerceTypes: true,
            strict: true, useDefaults: false, messages: true, verbose: true
        });
        ajv = addFormats(ajv, ["date-time", "relative-json-pointer"])
        
        // add vocabulary
        console.log("Adding vocabulary ...")
        ajv.addVocabulary([ChkPriceDef(), ChkQtyDef(), ChkQtyDef2(), ChkAssetToMktDef(), ChkMktToProductDef()]);

        // validate
        let validate = ajv.compile(schema);
        if (validate.call({ajv: ajv, cache: this.cache}, trades)) {
            // data is MyData here
            console.log("Trades validated successfully");
          } else {
              console.log("Validation errors: ")
              validate.errors?.forEach(error => console.log(error));

              return validate.errors
          } 
    }
};