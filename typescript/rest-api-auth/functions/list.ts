// [START snippet]

import { jwtScopes } from "@nitric/middleware-jwt";
import { faas, documents } from "@nitric/sdk";
import { Order, checkJwt } from "../common";

interface Result {
  id: string;
  content: Order;
}

faas
  .http(
    checkJwt({
      domain: "tenant.region.auth0.com",
      audience: "https://orders-api.example.com",
    }),
    jwtScopes(["read:orders"]),
    async (ctx): Promise<faas.HttpContext> => {
      const orders = documents().collection<Order>("orders");
      const results: Result[] = [];
      let token: any = null;
      while (true) {
        try {
          const page = await orders.query().pagingFrom(token).fetch();

          results.push(
            ...page.documents.map(({ id, content }) => ({
              id,
              content,
            }))
          );

          if (!page.pagingToken) {
            break;
          }

          token = page.pagingToken;
        } catch (e) {
          ctx.res.status = 500;
          return ctx.res.json({ message: e.stack });
        }
      }
      return ctx.res.json(results);
    }
  )
  .start();

// [END snippet]