import json
import dataclasses
from datetime import datetime
from dataclasses import dataclass, field

from nitric import faas
from nitric.faas import HttpContext, start
from nitric.api import Documents
from common.example import generate_id

@dataclass(frozen=True)
class OrderRequest:
  itemId: str
  customerId: str
  id: str = field(default_factory=lambda: str(generate_id()))
  dateOrdered: str = field(default_factory=lambda: str(datetime.now()))

async def httpHandler(ctx: HttpContext) -> HttpContext:
  order = OrderRequest(**json.loads(ctx.req.data))
  orders = Documents().collection('orders')

  try:
    await orders.doc(order.id).set(dataclasses.asdict(order))
    ctx.res.status = 200
    ctx.res.body = f'Created example with ID: {order.id}'.encode('utf-8')
  except:
    ctx.res.status = 500
    ctx.res.body = b'Failed to create order'

  return ctx

if __name__ == "__main__":
  start(httpHandler)