// common/auth.ts

import { jwt, GetSecretOptions } from "@nitric/middleware-jwt";
import * as jwksRsa from "jwks-rsa";

const SUPPORTED_ALGOS = ["RS256"];

const nitricJwtSecret = (options) => {
  if (options === null || options === undefined) {
    throw new Error(
      "An options object must be provided when initializing expressJwtSecret"
    );
  }

  const client = jwksRsa(options);

  const secretProvider = async ({ ctx, header, payload }: GetSecretOptions) => {
    if (!header || !SUPPORTED_ALGOS.includes(header.alg)) {
      return null;
    }

    try {
      const key = await client.getSigningKey(header.kid);

      return key.getPublicKey();
    } catch (err) {
      throw err;
    }
  };
  return secretProvider;
};

export interface Auth0Config {
  domain: string;
  audience: string;
}

export const checkJwt = ({ domain, audience }: Auth0Config) =>
  jwt({
    secret: nitricJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${domain}/.well-known/jwks.json`,
    }),
    // Validate the audience and the issuer.
    verifyOptions: {
      audience,
      issuer: `https://${domain}/`,
    },
    algorithms: ["RS256"],
  });
