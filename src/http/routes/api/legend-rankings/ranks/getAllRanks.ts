import { RankModel } from '@/database/models';
import { Elysia } from 'elysia';

export const getAllRanks = new Elysia().get('/', async () => {
  return await RankModel.find({}).lean();
});
