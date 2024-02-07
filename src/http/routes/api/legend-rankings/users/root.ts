import { Elysia } from 'elysia';
import { sessionCookiePlugin } from '@/http';
import { getUserRank, saveUserRanking, updateRankingScore } from '.';

export const users = new Elysia().group(
  '/users',
  {
    detail: {
      tags: ['Users'],
    },
  },
  (app) =>
    app
      .use(sessionCookiePlugin())
      .use(getUserRank)
      .use(saveUserRanking)
      .use(updateRankingScore),
);
