import { Elysia } from 'elysia';
import { Mongoose } from '@/database';

export const health = new Elysia({ prefix: '/health' }).get(
  '/',
  ({ set }) => {
    const m = Mongoose.isHealthy(); // La conexión se puede restablecer luego
    const healthy = m;
    set.status = healthy ? 204 : 500;
    set.headers = {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    };
    return;
  },
  {
    detail: {
      tags: ['Health'],
      responses: {
        204: {
          description: 'Health check success',
        },
        500: {
          description: 'Health check failed',
        },
      },
    },
  },
);

//detail: {
//       tags: ['Health'],
//       responses: {
//         200: {
//           description: 'Health check',
//           content: {
//             'application/json': {
//               schema: {
//                 type: 'object',
//                 properties: {
//                   healthy: { type: 'boolean', default: true },
//                   mongoose: {
//                     type: 'boolean',
//                     description: 'Mongoose connection: true or false',
//                   },
//                   transactional: {
//                     type: 'boolean',
//                     description: 'Transactional connection: true or false',
//                   },
//                 },
//               },
//             },
//           },
//         },
//         500: {
//           description: 'Health check',
//           content: {
//             'application/json': {
//               schema: {
//                 type: 'object',
//                 properties: {
//                   healthy: { type: 'boolean', default: false },
//                   mongoose: {
//                     type: 'boolean',
//                     description: 'Mongoose connection: true or false',
//                   },
//                   transactional: {
//                     type: 'boolean',
//                     description: 'Transactional connection: true or false',
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
