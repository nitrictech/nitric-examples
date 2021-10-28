// [START snippet]

import { jwtScopes } from "@nitric/middleware-jwt";
import { faas, documents } from "@nitric/sdk";
import { checkJwt, path } from "../common";

faas
  .http(
    checkJwt({
      domain: "tenant.region.auth0.com",
      audience: "https://orders-api.example.com",
    }),
    jwtScopes(["read:orders"]),
    async (ctx): Promise<faas.HttpContext> => {
      // get params from path
      const { orderId } = path.test(ctx.req.path);

      if (!orderId) {
        ctx.res.body = new TextEncoder().encode("Invalid request");
        ctx.res.status = 400;
      }

      const orders = documents().collection("orders");

      try {
        const order = await orders.doc(orderId).get();
        ctx.res.json(order);
      } catch {
        ctx.res.status = 404;
        ctx.res.json({ message: "order not found" });
      }

      return ctx;
    }
  )
  .start();

// [END snippet]  