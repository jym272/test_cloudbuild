export interface Ranking {
  userId: string;
  username: string;
  score: number;
  displayName: string;
}

export interface PlayersScoreList {
  name: string;
  players: Ranking[];
}

export interface Player {
  userId: string;
  username: string;
  score: number;
  displayName: string;
}

export interface List {
  name: string;
  players: Player[];
}

export interface ListBasicData {
  name: string;
}

export interface UserBasicData {
  listId: string;
  userId: string;
}

export interface Rank {
  name: string;
  minimumScore: number;
  listId: string;
}

export interface UpdateUserScore {
  userId: string;
  listId: string;
  score: number;
}
