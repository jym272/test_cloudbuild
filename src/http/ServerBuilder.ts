import { Elysia } from 'elysia';
import { root } from '.';
import { corsPlugin } from '.';
import { Http } from '.';
import { swagger } from '@elysiajs/swagger';
import { httpLogger } from '@/logger';

export class ServerBuilder {
  private readonly server: Elysia;

  private constructor() {
    this.server = new Elysia();
    // this.server.use(
    //   cors({
    //     origin: getEnvOrFail("CORS_LIST").split(","),
    //     // allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
    //     // allowMethods: ['POST', 'GET', 'OPTIONS'],
    //     // exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    //     // maxAge: 600,
    //     credentials: true,
    //   }),
    // );
    this.server.onError(({ error, set, code }) => {
      Http.log.error({ '❯': error });
      switch (code) {
        case 'NOT_FOUND':
          set.status = 404;
          break;
        case 'INTERNAL_SERVER_ERROR':
          set.status = 500;
          break;
        case 'UNKNOWN': {
          set.status = 500;
          break;
        }
        case 'VALIDATION': {
          set.status = 400;
          break;
        }
        case 'PARSE': {
          set.status = 400;
          break;
        }
        case 'INVALID_COOKIE_SIGNATURE': {
          set.status = 401;
          break;
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      return { message: error.toString() };
    });
  }

  public static create() {
    return new ServerBuilder();
  }

  public addPlugins(): this {
    const plugins = [corsPlugin];
    for (const p of plugins) {
      this.server.use(p);
    }
    if (process.env.NODE_ENV !== 'production') {
      this.server.use(
        swagger({
          path: '/api/legend-rankings/doc',
          // https://github.com/elysiajs/elysia-swagger/issues/97
          scalarConfig: {
            spec: { url: '/api/legend-rankings/doc/json' },
          },
          // provider: 'swagger-ui',
          documentation: {
            info: {
              title: 'Legend Rankings',
              version: '1.0.0',
              description: 'Se envía emails con el cliente de google',
            },
            tags: [
              { name: 'Lists', description: 'Lists endpoints' },
              { name: 'Ranks', description: 'Ranks endpoints' },
              { name: 'Users', description: 'Users endpoints' },
            ],
          },
        }),
      );
    }
    this.server.use(httpLogger());
    return this;
  }

  public addRoutes(): this {
    this.server.use(root);
    return this;
  }

  public build() {
    return this.server;
  }
}
