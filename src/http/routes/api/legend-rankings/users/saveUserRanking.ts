import { ListModel } from '@/database/models';
import type { Player } from '@/database/types';
import { NotFoundError } from 'elysia';
import { Elysia, t } from 'elysia';

const idParams = t.Object({
  id: t.String(),
});

export const saveRanking = async (id: string, ranking: Player) => {
  const list = await ListModel.findOne({ _id: id });

  if (!list) {
    throw new NotFoundError('List not found');
  }

  list.players.push(ranking);
  return list.players;
};

export const saveUserRanking = new Elysia().post(
  '/:id',
  async ({ body: ranking, params: { id } }) => {
    return await saveRanking(id, ranking);
  },
  {
    body: t.Object({
      userId: t.String(),
      username: t.String(),
      score: t.Numeric(),
      displayName: t.String(),
    }),
    params: idParams,
  },
);
