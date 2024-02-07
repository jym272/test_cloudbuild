import { ListModel } from '@/database/models';
import { Elysia, NotFoundError, t } from 'elysia';

const idParams = t.Object({
  id: t.String(),
});

const queryParams = t.Object({
  page: t.String(),
  max: t.String(),
});

export const getById = async (id: string, page: number, max: number) => {
  try {
    const list = await ListModel.findOne({ _id: id }).select('-__v');

    if (!list) {
      throw new NotFoundError('List not found');
    }

    const startIndex = (page - 1) * max;
    const endIndex = page * max;

    const paginatedPlayers = list.players
      .sort((a, b) => b.score - a.score)
      .slice(startIndex, endIndex);

    const paginatedList = {
      ...list.toObject(),
      players: paginatedPlayers,
      totalPlayers: list.players.length,
    };

    return paginatedList;
  } catch (error) {
    console.error('Error al buscar la lista por id:', error);
    throw error;
  }
};

export const getListById = new Elysia().get(
  '/:id',
  async ({ params: { id }, query: { page, max } }) => {
    return await getById(id, parseInt(page), parseInt(max));
  },
  {
    params: idParams,
    query: queryParams,
  },
);
