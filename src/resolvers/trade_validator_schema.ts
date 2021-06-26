import { gql } from "@apollo/client/core";
import { Trade } from "../core/shared/Types";
import { Validate } from "../core/main";

export const resolvers = {
    Query: {
        ValidateTrades: (_: void, args: void) => {
            if (args === undefined) {
                return 
            }

            return Validate(args.trades as Trade[])
        }
    }
}

export const typeDef = gql`
    type Query {
        ValidateTrades(trades: [Trade]): Result
    }

    input Trade {
        start_date: String!
        end_date: String!
        portfolio: String!
        asset: String!
        market: String!
        product: String
        quantity: Float!
        price: Float!
    }

    type ValidationError {
        seq_id: String!
        keyword: String!
        field: String!
        value: String
        error_message: String!
        allowed: [String]
    }

    type Result {
        errors: [ValidationError]
        success: Boolean!
    }
`;