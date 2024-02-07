import { ListModel } from '@/database/models';
import { Elysia, t } from 'elysia';

const idParams = t.Object({
  id: t.String(),
});

export const deleteListById = async (id: string) => {
  return ListModel.findByIdAndDelete(id);
};

export const deleteList = new Elysia().delete(
  '/:id',
  async ({ params: { id } }) => {
    return await deleteListById(id);
  },
  {
    params: idParams,
  },
);
