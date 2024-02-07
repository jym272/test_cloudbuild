import { RankModel } from '@/database/models';
import { Elysia, NotFoundError, t } from 'elysia';

const idParams = t.Object({
  id: t.String(),
});

export const getRanksByListId = new Elysia().get(
  '/list/:id',
  async ({ params: { id }, set }) => {
    const ranks = await RankModel.find({ listId: id });
    const sortedRanks = ranks.sort((a, b) => b.minimumScore - a.minimumScore);
    if (sortedRanks.length === 0) {
      set.status = 404;
      throw new NotFoundError('Ranks not found');
    }
    return sortedRanks;
  },
  {
    params: idParams,
  },
);
