import Ajv from 'ajv';
import { DataValidateFunction, DataValidationCxt, ErrorObject } from 'ajv/dist/types';
import type { FuncKeywordDefinition } from 'ajv';

import { Trade } from '../../../shared/Types';
import {Cache} from '../../../cache/Cache';

/**
 * Type definition for helper functions
 * @desc: helper function for 'check_quantity' keyword handler
 * @param cache: cache for facts and running values
 * @param parentData: trade record data
 * @param property: quantity
 * @param data: quantity value
 * @returns: boolean. If valid or not
 */
type DataValidateHelperFunc = (cache: Cache, pd: Trade, property: string, data: number) => boolean | Array<ErrorObject>;

/**
 * @desc: GenerateFuncKeywordDefinition(): Creates AJV FuncKeywordDefinition object
 * @param kw: custom keyword, defining a business rule
 * @param helperFunc: function which validates a particular business rule 
 * @returns FuncKeywordDefinition: Add the returned value to the ajv vocabulary
 */
function GenerateFuncKeywordDefinition(kw: string, helperFunc: DataValidateHelperFunc): FuncKeywordDefinition {
    return {
        keyword: kw,
        type: ["string", "number"],
        schema: false,
        schemaType: "boolean",
        validate: function v(this: Ajv | any, data: number, dataCxt: any): boolean {
            let pd = (dataCxt as DataValidationCxt).parentData;
            let property = (dataCxt as DataValidationCxt).parentDataProperty
            let res = helperFunc(this.cache as Cache, pd as Trade, property as string, data)
            if (typeof res === 'boolean') {
            return true
            } else {
            (v as DataValidateFunction).errors = res
            }
    
            return false;
        } as DataValidateFunction,
        errors: true,
        metaSchema: {
            "type": "boolean"
        }
    }
}

export { DataValidateHelperFunc, GenerateFuncKeywordDefinition }