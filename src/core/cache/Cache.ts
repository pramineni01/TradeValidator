import Loki = require("lokijs");
import {JSONSchemaType} from 'ajv';
import {TradeFact, Facts, TradeIdentifier} from "../shared/Types";
import {DataProvider} from '../dataprovider/DataProvider';

type schemaCollectionType = {
    name: string;
    schema: JSONSchemaType<Array<TradeFact>>;
};

export class Cache {
    private isReady: boolean;
    private db: Loki;
    
    // collection to hold schema for trade validation 
    protected schemaColl: Loki.Collection<schemaCollectionType>;

    // trade fact values collection 
    protected factsColl: Loki.Collection<TradeFact>;

    // trade running values collection
    protected runningValColl: Loki.Collection<TradeFact>;
    
    // ctor
    constructor() {
        this.isReady = false;

        this.db = new Loki("trade-validations", { autosave: false });
        this.schemaColl = this.db.addCollection('schema');
        this.factsColl = this.db.addCollection('facts');
        this.runningValColl = this.db.addCollection('runningValues');
    }

    // populate cache
    Populate(provider: DataProvider): boolean {
        // schema
        let schema = provider.GetSchema();
        if (schema === null) {
            this.Close();
            return false;
        }
        this.schemaColl.insert({"name": "trade-validation-schema", "schema": schema as JSONSchemaType<Array<TradeFact>>});

        // constant trade facts
        let rfs = provider.GetResourceFacts()
        if (rfs === null){
            this.Close();
            return false;
        }
        this.factsColl.insert(rfs);

        // running values so far
        let rvs = provider.GetRunningValues()
        if (rvs === null){
            this.Close();
            return false;
        }
        this.runningValColl.insert(rvs)

        this.isReady = true;
        return true;
    }

    /**
     * Close(): delete the cache internal storage
     * @param: none
     * @return: none
     */ 
    Close() {
        this.db.removeCollection(this.schemaColl.name);
        this.db.removeCollection(this.factsColl.name);
        this.db.removeCollection(this.runningValColl.name);
        this.db.deleteDatabase();
    }

    /**
     * GetSchema(): returns schema stored in cache
     * @param: none
     * @return: object or null
     */
    GetSchema(): JSONSchemaType<Array<TradeFact>> | null {
        if (this.isReady === false) {
            console.log("Cache: Not ready yet");
            return null;
        }

        let schemaObj = this.schemaColl.findOne({"name": "trade-validation-schema"});
        if (schemaObj === null) {
            console.log("Cache: Schema not available");
            return null;
        }

        return schemaObj.schema;
    }

    /**
     * GetTradeFact(): returns the fact from factsColl cache
     * @param: identifier for the trade fact.
     * @return: TradeFact
     */ 
    GetResourceFact(id: TradeIdentifier): TradeFact | null {
        if (this.isReady === false) {
            console.log("Cache: Not ready yet");
            return null;
        }

        return this.factsColl.findOne(id);
    }

    /**
    * GetRunningValue(): gets the Fact as running value in runningValColl cache
    * @param: TradeIdentifier
    * @param: value interested in
    * @return: running running value as Fact
    */
    GetRunningValues(id: TradeIdentifier): TradeFact | null {
        if (this.isReady === false) {
            console.log("Cache: Not ready yet");
            return null;
        }

        let rvtf = this.runningValColl.findOne(id);
        if (rvtf === null) {
            return null
        }

        return rvtf;
    }

    /**
    * UpsertRunningVal(): sets the TradeFact as running value in runningValColl cache
    * @param: running value in a TradeFact
    * @return: success or failure
    */
    UpsertRunningVal(currRV: TradeFact) {
        let filter: TradeIdentifier = { 
                start_date: currRV.start_date,
                end_date: currRV.end_date,
                portfolio: currRV.portfolio,
                asset: currRV.asset,
                market: currRV.market
            };

        let tfInCache = this.runningValColl.findOne(filter)
        if (tfInCache === null) {
            //insert
            this.runningValColl.insertOne(currRV);
        } else {
            // update the running value fields
            Object.assign(tfInCache.facts, currRV.facts)
            this.runningValColl.update(tfInCache);

            // update
            /*currRV.facts.forEach(function(rvfact, rvIdx, rvfacts) {
                tfInCache?.facts.forEach(function(factInCache, cIdx, factsInCache){
                    if (factInCache.key === rvfact.key) {
                        factInCache.val = rvfact.val;
                    }
                });                
            })
            this.runningValColl.update(tfInCache)*/
        }
    }
};

export function NewCache(provider: DataProvider): Cache {
    let cache = new Cache()
    cache.Populate(provider);
    return cache;
}