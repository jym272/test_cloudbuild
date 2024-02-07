import { cors } from '@elysiajs/cors';
import { getEnvOrFail } from '@/env';

// export const corsPlugin = cors({
//   origin: getEnvOrFail("CORS_LIST").split(","),
//   // allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
//   // allowMethods: ['POST', 'GET', 'OPTIONS'],
//   // exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
//   // maxAge: 600,
//   credentials: true,
// });

const corsList = getEnvOrFail('CORS_LIST').split(',');
export const corsPlugin = cors({
  origin: (request: Request): boolean => {
    const origin = request.headers.get('origin');
    if (!origin) {
      return false;
    }
    console.log('allowedOrigins', corsList, corsList.includes(origin));
    return corsList.includes(origin);
  },
  // exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  // maxAge: 600,
  credentials: true,
  allowedHeaders: [
    'X-Custom-Header',
    'Upgrade-Insecure-Requests',
    'Content-Type',
  ],
  methods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
});
