import { ListModel } from '@/database/models';
import { Elysia } from 'elysia';

export const getAll = async () => {
  try {
    const listsWithPlayerCount = await ListModel.aggregate([
      {
        $project: {
          _id: 1,
          name: 1,
          playersCount: { $size: '$players' },
          highestScore: {
            $ifNull: [
              {
                $max: {
                  $map: {
                    input: '$players',
                    as: 'player',
                    in: '$$player.score',
                  },
                },
              },
              0,
            ],
          },
        },
      },
    ]);

    const listsCount = listsWithPlayerCount.length;

    return { lists: listsWithPlayerCount, listsCount };
  } catch (error) {
    console.error(
      'Error al obtener listas con recuento de jugadores y puntuación más alta:',
      error,
    );
    throw error;
  }
};

export const getAllLists = new Elysia().get('/', async () => {
  return await getAll();
});
