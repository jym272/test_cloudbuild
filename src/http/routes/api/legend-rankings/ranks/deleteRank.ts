import { RankModel } from '@/database/models';
import { Elysia, t } from 'elysia';

const idParams = t.Object({
  id: t.String(),
});

export const deleteRank = new Elysia().delete(
  '/:id',
  async ({ params: { id } }) => {
    return RankModel.findByIdAndDelete(id);
  },
  {
    params: idParams,
  },
);
