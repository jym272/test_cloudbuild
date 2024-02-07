import { sessionCookiePlugin } from '@/http';
import { Elysia } from 'elysia';
import {
  createRank,
  deleteRank,
  getAllRanks,
  getRankById,
  getRanksByListId,
  updateRank,
} from '.';

export const ranks = new Elysia().group(
  '/ranks',
  {
    detail: {
      tags: ['Ranks'],
    },
  },
  (app) =>
    app
      .use(sessionCookiePlugin())
      .use(getAllRanks)
      .use(getRankById)
      .use(getRanksByListId)
      .use(createRank)
      .use(updateRank)
      .use(deleteRank),
);
