# [START snippet]

import json

from nitric.faas import HttpContext, http
from nitric.api import Documents

async def httpHandler(ctx: HttpContext) -> HttpContext:
  order_id = ctx.req.path.split("/")[-1]  # use a parser in a real project.
  orders = Documents().collection("orders")

  try:
    order = await orders.doc(order_id).get()

    ctx.res.status = 200
    ctx.res.body = json.dumps(order.content).encode('utf-8')
  except:
    ctx.res.status = 404
    ctx.res.body = 'Order with id: {order_id} not found'.encode("utf-8")
  
  return ctx

if __name__ == "__main__":
  http(httpHandler).start()

# [END snippet]