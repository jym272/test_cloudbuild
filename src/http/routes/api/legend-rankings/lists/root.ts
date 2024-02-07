import { sessionCookiePlugin } from '@/http';
import { Elysia } from 'elysia';
import {
  createNewList,
  deleteList,
  getAllLists,
  getListById,
  getRankingOfList,
  updateListById,
} from '.';

export const lists = new Elysia().group(
  '/lists',
  {
    detail: {
      tags: ['Lists'],
    },
  },
  (app) =>
    app
      .use(sessionCookiePlugin())
      .use(getAllLists)
      .use(getListById)
      .use(getRankingOfList)
      .use(createNewList)
      .use(updateListById)
      .use(deleteList),
);
