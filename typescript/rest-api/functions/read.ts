// [START snippet]
// functions/read.ts

import { faas, documents } from "@nitric/sdk";
import { path } from "../common";

// Start your function here
faas
  .http(async (ctx: faas.HttpContext): Promise<faas.HttpContext> => {
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
  })
  .start();

// [END snippet]  