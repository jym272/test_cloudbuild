import type { Rank } from '@/database/types';
import { model, Schema } from 'mongoose';

const schema = new Schema<Rank>({
  name: { type: String, required: true },
  minimumScore: { type: Number, required: true },
  listId: { type: String, required: true },
});

export const RankModel = model<Rank>('rank', schema);
