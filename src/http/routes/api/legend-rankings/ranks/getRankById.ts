import { RankModel } from '@/database/models';
import { Elysia, NotFoundError, t } from 'elysia';

const idParams = t.Object({
  id: t.String(),
});

export const getRankById = new Elysia().get(
  '/:id',
  async ({ params: { id }, set }) => {
    const rank = await RankModel.findById(id);
    if (!rank) {
      set.status = 404;
      throw new NotFoundError('Rank not found');
    }
    return rank;
  },
  {
    params: idParams,
  },
);
