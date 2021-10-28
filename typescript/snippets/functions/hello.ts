// [START snippet]

import { faas } from '@nitric/sdk';

faas
  .http(async (ctx: faas.HttpContext): Promise<faas.HttpContext> => {
    ctx.res.body = 'Hello World!';

    return ctx;
  })
  .start();

// [END snippet]