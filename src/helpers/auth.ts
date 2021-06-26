import { AuthenticationError } from "apollo-server";

export const authorize = ({ req }: any) => {
  const token = req.headers.authorization;

  if (token !== process.env.ACCESS_TOKEN) {
    console.log("query name", req.body.operationName);
    if (req.body.query) console.log("query body", req.body.query.slice(0, 100));
    console.log(
      "invalid authorization token from IP ",
      req.header("x-forwarded-for") || req.connection.remoteAddress
    );
    throw new AuthenticationError("you are not authorized");
  }
};
