import { model, Schema } from 'mongoose';
import type { List, PlayersScoreList, Ranking } from '@/database/types';

const userScoreSchema = new Schema<Ranking>({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  score: { type: Number, default: 0 },
  displayName: { type: String, default: '' },
});

const schema = new Schema<PlayersScoreList>({
  name: { type: String, required: true },
  players: { type: [userScoreSchema], default: [] },
});

export const ListModel = model<List>('list', schema);
