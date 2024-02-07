import { Elysia } from 'elysia';

export const ping = new Elysia({ prefix: '/ping' }).get('/', () => 'pong', {
  detail: {
    tags: ['Health'],
    responses: {
      200: {
        description: 'pong',
      },
    },
  },
});
