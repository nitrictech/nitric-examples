# [START snippet]

from nitric.faas import HttpContext, start

async def handler(ctx: HttpContext) -> HttpContext:
  ctx.res.body = b'Hello World!'
  return ctx


if __name__ == "__main__":
  start(handler)

# [END snippet]  