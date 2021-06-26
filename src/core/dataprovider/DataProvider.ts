import {Trade,TradeFact} from '../shared/Types';

export abstract class DataProvider {
    abstract GetSchema(): Object | null;
    
    abstract GetResourceFacts(): Array<TradeFact> | null;

    abstract GetRunningValues(): Array<TradeFact> | null;
};

