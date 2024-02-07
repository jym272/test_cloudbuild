import { ListModel } from '@/database/models';
import { Elysia, NotFoundError, t } from 'elysia';

const idParams = t.Object({
  id: t.String(),
});

const queryParams = t.Object({
  page: t.String(),
  max: t.String(),
});

export const getRankingOfAList = async (
  id: string,
  page: number,
  max: number,
) => {
  try {
    const list = await ListModel.findOne({ _id: id }).select('players');

    if (!list) {
      throw new NotFoundError('List not found');
    }

    list.players.sort((a, b) => b.score - a.score);

    const offset = page - 1 * max;
    const paginatedPlayers = list.players.slice(offset, offset + max);

    return paginatedPlayers;
  } catch (error) {
    console.error('Error al buscar la lista por id:', error);
    throw error;
  }
};

export const getRankingOfList = new Elysia().get(
  '/rankingList/:id',
  async ({ params: { id }, query: { page, max } }) => {
    return await getRankingOfAList(id, parseInt(page), parseInt(max));
  },
  {
    params: idParams,
    query: queryParams,
  },
);
