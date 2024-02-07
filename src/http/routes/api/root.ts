import { Elysia } from 'elysia';
import { legend_rankings } from '.';

export const api = new Elysia({ prefix: '/api' }).use(legend_rankings);
