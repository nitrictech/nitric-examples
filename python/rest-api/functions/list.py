# [START snippet]
# functions/list.py

import json

from nitric.faas import HttpContext, http
from nitric.api import Documents

async def httpHandler(ctx: HttpContext) -> HttpContext:
  orders = Documents().collection("orders")
  results = []
  token = None

  try:
    while True:
      page = await orders.query().page_from(token).fetch()
      results += [{"content": doc.content, "id": doc.id} for doc in page.documents]
      token = page.paging_token
      if not token:
        ctx.res.status = 200
        ctx.res.body = json.dumps(results).encode('utf-8')
        break
  except:
    ctx.res.status = 500
    ctx.res.body = json.dumps({"message":"Orders not found"}).encode('utf-8')

  return ctx

if __name__ == "__main__":
  http(httpHandler).start()

# [END snippet]