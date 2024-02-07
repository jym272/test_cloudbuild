import { ListModel } from '@/database/models';
import type { ListBasicData } from '@/database/types';
import { Elysia, NotFoundError, t } from 'elysia';

const idParams = t.Object({
  id: t.String(),
});

export const updateList = async (id: string, listBodyData: ListBasicData) => {
  const list = await ListModel.findByIdAndUpdate(
    id,
    { $set: { name: listBodyData.name } },
    { new: true },
  );

  if (!list) {
    throw new NotFoundError('List not found');
  }

  return list;
};

export const updateListById = new Elysia().put(
  '/:id',
  async ({ body: listBodyData, params: { id } }) => {
    return await updateList(id, listBodyData);
  },
  {
    body: t.Object({
      name: t.String(),
    }),
    params: idParams,
  },
);
