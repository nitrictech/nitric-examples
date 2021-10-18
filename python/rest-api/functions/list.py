
from nitric.api import Documents
from nitric.faas import start, Trigger, Response

async def handler(request: Trigger) -> list:
  orders = Documents().collection("orders")
  results = []
  token = None

  while True:
    page = await orders.query().page_from(token).fetch()
    results += [{"content": doc.content, "id": doc.id} for doc in page.documents]
    token = page.paging_token
    if not token:
        break
  return results


if __name__ == "__main__":
  start(handler)