import { RankModel } from '@/database/models';
import { Elysia, t } from 'elysia';

const rankBodyData = t.Object({
  name: t.String(),
  minimumScore: t.Number(),
  listId: t.String(),
});

export const createRank = new Elysia().post(
  '/',
  async ({ body: rank }) => {
    return await RankModel.create(rank);
  },
  {
    body: rankBodyData,
  },
);
