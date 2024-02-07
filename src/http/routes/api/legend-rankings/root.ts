import { Elysia } from 'elysia';
import { lists, ranks, users, ping } from '.';

export const legend_rankings = new Elysia({
  prefix: '/legend-rankings',
})
  .use(ping)
  .use(lists)
  .use(ranks)
  .use(users);
