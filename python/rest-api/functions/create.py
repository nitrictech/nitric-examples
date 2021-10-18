import dataclasses
from datetime import datetime
from dataclasses import dataclass, field
from typing import Union

from nitric.faas import start, Trigger, Response
from nitric.api import Documents
from common.example import generate_id


@dataclass(frozen=True)
class OrderRequest:
  itemId: str
  customerId: str
  id: str = field(default_factory=lambda: str(generate_id()))
  dateOrdered: str = field(default_factory=lambda: str(datetime.now()))


async def handler(request: Trigger) -> Union[dict, Response]:
  order = OrderRequest(**request.get_object())

  orders = Documents().collection('orders')

  try:
    await orders.doc(order.id).set(dataclasses.asdict(order))
    return {"message": "success", "orderId": order.id}
  except:
    response = request.default_response()
    response.context.as_http().status = 500
    response.data = {"message": "failed to create order"}
    return response


if __name__ == "__main__":
  start(handler)