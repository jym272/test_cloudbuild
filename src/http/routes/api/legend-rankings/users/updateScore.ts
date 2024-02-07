import { ListModel } from '@/database/models';
import type { UpdateUserScore } from '@/database/types';
import { Elysia, NotFoundError, t } from 'elysia';

export const updateUserScore = async (updateScore: UpdateUserScore) => {
  const list = await ListModel.findOne({ _id: updateScore.listId });

  if (!list) {
    throw new NotFoundError('List not found');
  }

  const user = list.players.find(
    (player) => player.userId === updateScore.userId,
  );

  if (!user) {
    throw new NotFoundError('User not found');
  }

  user.score = updateScore.score;

  return await list.save();
};

export const updateRankingScore = new Elysia().put(
  '/',
  async ({ body: updateScore }) => {
    return await updateUserScore(updateScore);
  },
  {
    body: t.Object({
      userId: t.String(),
      listId: t.String(),
      score: t.Number(),
    }),
  },
);
