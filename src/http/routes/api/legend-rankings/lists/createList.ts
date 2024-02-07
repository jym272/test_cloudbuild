import { ListModel } from '@/database/models';
import type { ListBasicData } from '@/database/types';
import { Elysia, t } from 'elysia';
import type { List } from '@/database/types';

const listBodyData = t.Object({
  name: t.String(),
});

export const createList = async (list: ListBasicData) => {
  const newList = await ListModel.create(list);

  const newListDetails = await ListModel.aggregate<List>([
    {
      $match: { _id: newList._id },
    },
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

  return newListDetails[0];
};

export const createNewList = new Elysia().post(
  '/',
  async ({ body: list }) => {
    return await createList(list);
  },
  {
    body: listBodyData,
  },
);
