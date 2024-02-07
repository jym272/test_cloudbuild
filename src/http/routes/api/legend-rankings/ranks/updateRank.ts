import { RankModel } from '@/database/models';
import { Elysia, NotFoundError, t } from 'elysia';

const idParams = t.Object({
  id: t.String(),
});

const rankBodyData = t.Object({
  name: t.String(),
  minimumScore: t.Number(),
  listId: t.String(),
});

export const updateRank = new Elysia().put(
  '/:id',
  async ({ params: { id }, body: rank, set }) => {
    const u = await RankModel.findByIdAndUpdate(
      id,
      { $set: rank },
      { $new: true },
    );
    if (!u) {
      set.status = 404;
      throw new NotFoundError('Rank not found');
    }
    return u;
  },
  {
    params: idParams,
    body: rankBodyData,
  },
);
