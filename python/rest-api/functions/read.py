from typing import Union

from nitric.api import Documents
from nitric.faas import start, Trigger, Response


async def handler(request: Trigger) -> Union[dict, Response]:
  order_id = request.context.as_http().path.split("/")[2]  # use a parser in a real project.

  orders = Documents().collection("orders")

  try:
    order = await orders.doc(order_id).get()

    return {
      "id": order.id,
      "order": order.content,
    }
  except:
    response = request.default_response()
    response.context.as_http().status = 404
    response.data = {"message": f"order with id: {order_id} not found"}
    return response


if __name__ == "__main__":
  start(handler)