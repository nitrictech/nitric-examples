// functions/list.ts

import { faas, documents } from "@nitric/sdk";
import { Order } from "../common";

interface Result {
  id: string;
  content: Order;
}

faas
  .http(async (ctx: faas.HttpContext): Promise<faas.HttpContext> => {
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
  })
  .start();
