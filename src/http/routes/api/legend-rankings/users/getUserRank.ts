import { Elysia, t } from 'elysia';
import { ListModel, RankModel } from '@/database/models';
import type { UserBasicData } from '@/database/types';
import { NotFoundError } from 'elysia';

export const getRankOfUser = async (usernameData: UserBasicData) => {
  const list = await ListModel.findOne({ _id: usernameData.listId });

  if (!list) {
    throw new NotFoundError('List not found');
  }

  const user = list.players.find(
    (player) => player.userId === usernameData.userId,
  );

  if (!user) {
    throw new NotFoundError("User doesn't exist");
  }

  const ranks = await RankModel.find({ listId: list._id });

  if (ranks.length === 0) {
    throw new NotFoundError('There are no ranks registered for this list');
  }

  const sortedRanks = [...ranks].sort(
    (a, b) => b.minimumScore - a.minimumScore,
  );

  for (const rank of sortedRanks) {
    if (user.score >= rank.minimumScore) {
      return rank.name;
    }
  }

  return 'Without rank';
};

export const getUserRank = new Elysia().post(
  '/',
  async ({ body: calculateRankBodyData }) => {
    return await getRankOfUser(calculateRankBodyData);
  },
  {
    body: t.Object({
      listId: t.String(),
      userId: t.String(),
    }),
  },
);
