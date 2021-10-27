// [START snippet]
// functions/create.ts

import { faas, documents } from "@nitric/sdk";
import { uuid } from "uuidv4";
import { Order } from "../common";

// Requests to create a new order won't have an id or order date
type RequestData = Omit<Order, "id" | "dateOrdered">;

interface CreateContext extends faas.HttpContext {
  req: faas.HttpRequest & {
    body?: RequestData;
  };
}

interface CreateResponse {
  message: string;
  orderId?: string;
}

// Start your function here
faas
  .http(
    faas.json(), //  use json body parser middleware to decode data
    async (ctx: CreateContext): Promise<faas.HttpContext> => {
      const data = ctx.req.body;
      const response = ctx.res;

      const order: Order = {
        ...data, // extract data from the request
        id: uuid(), // generate a new uuid
        dateOrdered: new Date().toJSON(),
      };

      const orders = documents().collection<Order>("orders");

      try {
        // Write the new order document to the orders collection
        await orders.doc(order.id).set(order);
        response.body = order.id;
        response.json({
          message: "success",
          orderId: order.id,
        } as CreateResponse);
      } catch {
        response.status = 500;
        response.body = new TextEncoder().encode("failed to create order");
      }

      return ctx;
    }
  )
  .start();

// [END snippet]